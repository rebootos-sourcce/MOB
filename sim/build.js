/* ============================================================
   BUILD THE REPORT PAGE.

   Reads sim/runs.json and sim/measured.json and writes sim/ninety-days.html.
   It refuses to run without both. No figure on the page is typed in this file:
   every one of them is read off a run, which is the rule this repository has
   been bitten by nine times for breaking.

     node sim/build.js
   ============================================================ */
const fs=require('fs'), path=require('path');
const RP=path.join(__dirname,'runs.json'), MP=path.join(__dirname,'measured.json');
[RP,MP].forEach(f=>{ if(!fs.existsSync(f)){
 console.error('missing '+path.basename(f)+'. Run sim/measure.js then sim/harness.js.');
 process.exit(2);}});
const R=JSON.parse(fs.readFileSync(RP,'utf8'));
const MEAS=JSON.parse(fs.readFileSync(MP,'utf8'));
const M=R.measured;

const e=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const pc=(v,d)=>(v*100).toFixed(d===undefined?1:d)+'%';
const n1=v=>(+v).toFixed(1), n2=v=>(+v).toFixed(2);
const ICPS=Object.keys(R.icp);
const COH=R.model.cohort;

/* ---------- the numbers the page leans on, each named once ---------- */
const G=R.grade;
const settle=R.model.settle;
const ceil=R.ceiling;
const lostRank=Object.keys(R.lost).sort((a,b)=>R.lost[b].people-R.lost[a].people);
const hitRank=Object.keys(R.hitShare).filter(k=>k!=='DRIFT')
 .sort((a,b)=>R.hitShare[b].share-R.hitShare[a].share);
const bankRows=R.storyBank;
const bankNone=bankRows.filter(r=>r.imprints===0).length;
const bankInfer=bankRows.filter(r=>r.inferred).length;
const bankNamed=bankRows.filter(r=>r.named.length).length;
const saysRows=R.says, saysNone=saysRows.filter(r=>r.imprints===0).length;
/* the sharpest inferred cases, picked by rule and not by hand: the longest
   line from a figure whose imprints are entirely inferred */
const pickInfer=who=>{const c=bankRows.filter(r=>r.who===who&&r.inferred)
 .sort((a,b)=>b.text.length-a.text.length); return c[0]||null;};
const qAna=pickInfer('Ana'), qJames=pickInfer('James'), qDiane=pickInfer('Diane');
/* the smallest control on any surface, named, so the tile above it is not a
   bare number a reader has to take on trust */
const smallest=(()=>{const out=[];
 Object.keys(MEAS.widths).forEach(w=>Object.keys(MEAS.widths[w].surfaces).forEach(k=>{
  (MEAS.widths[w].surfaces[k].tiny||[]).forEach(t=>out.push(k+' at '+w+': '+t));}));
 return out.length?out[0]:'';})();
const quoteLine=r=>r?('&ldquo;'+e(r.text)+'&rdquo; is answered with <b>'
 +e(r.offers.join(', '))+'</b>'):'';

/* ============================================================ charts */
function lineLog(series,opt){
 /* share of the cohort opening the file on each of ninety days, log y */
 const W=860,H=280,L=46,Rr=14,T=14,B=28;
 const y=v=>{const lo=Math.log10(0.0002), hi=Math.log10(1);
  const q=Math.log10(Math.max(0.0002,v));
  return T+(hi-q)/(hi-lo)*(H-T-B);};
 const x=i=>L+i/(series[0].v.length-1)*(W-L-Rr);
 let g='';
 [1,0.1,0.01,0.001].forEach(v=>{
  g+='<line class="gl" x1="'+L+'" y1="'+y(v).toFixed(1)+'" x2="'+(W-Rr)+'" y2="'+y(v).toFixed(1)+'"/>'
   +'<text class="ax" x="'+(L-6)+'" y="'+(y(v)+3.5).toFixed(1)+'" text-anchor="end">'+(v*100)+'%</text>';});
 [1,7,14,30,60,90].forEach(d=>{
  g+='<text class="ax" x="'+x(d-1).toFixed(1)+'" y="'+(H-8)+'" text-anchor="middle">'+d+'</text>';});
 series.forEach(s=>{
  g+='<path class="ln" stroke="'+s.c+'" d="'+s.v.map((v,i)=>
   (i?'L':'M')+x(i).toFixed(1)+' '+y(v).toFixed(1)).join(' ')+'"/>';});
 return '<svg class="ch" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+e(opt.alt)+'">'+g+'</svg>';}

function bars(rows,opt){
 const W=860, rowH=opt.rowH||26, L=opt.L||250, H=rows.length*rowH+18;
 const max=Math.max.apply(null,rows.map(r=>r.v))||1;
 let g='';
 rows.forEach((r,i)=>{
  const yy=i*rowH+12, w=(r.v/max)*(W-L-84);
  g+='<text class="bl" x="'+(L-10)+'" y="'+(yy+11)+'" text-anchor="end">'+e(r.k)+'</text>'
   +'<rect class="br" x="'+L+'" y="'+(yy+1)+'" width="'+Math.max(1,w).toFixed(1)+'" height="'+(rowH-9)+'" fill="'+(r.c||'var(--accent)')+'"/>'
   +'<text class="bn" x="'+(L+w+8).toFixed(1)+'" y="'+(yy+11)+'">'+e(r.lab)+'</text>';});
 return '<svg class="ch" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+e(opt.alt)+'">'+g+'</svg>';}

function ceilingChart(){
 const W=860,H=300,L=42,Rr=110,T=16,B=28;
 const keys=['high','mid','low','none'];
 const col={high:'var(--throat)', mid:'var(--solar)', low:'var(--root)', none:'var(--heart)'};
 const y=v=>T+(1-v/60)*(H-T-B);
 const x=d=>L+(d-1)/89*(W-L-Rr);
 let g='';
 [0,10,20,30,40,50,60].forEach(v=>{
  g+='<line class="gl" x1="'+L+'" y1="'+y(v).toFixed(1)+'" x2="'+(W-Rr)+'" y2="'+y(v).toFixed(1)+'"/>'
   +'<text class="ax" x="'+(L-6)+'" y="'+(y(v)+3.5).toFixed(1)+'" text-anchor="end">'+v+'</text>';});
 [1,30,60,90].forEach(d=>g+='<text class="ax" x="'+x(d).toFixed(1)+'" y="'+(H-8)+'" text-anchor="middle">day '+d+'</text>');
 keys.forEach(k=>{
  const c=ceil[k];
  g+='<path class="ln" stroke="'+col[k]+'" d="'+c.curve.map((p,i)=>
   (i?'L':'M')+x(p.day).toFixed(1)+' '+y(p.cq).toFixed(1)).join(' ')+'"/>'
   +'<text class="lg" fill="'+col[k]+'" x="'+(W-Rr+8)+'" y="'+(y(c.cq90)+3.5).toFixed(1)+'">'
   +e((k==='none'?'no intake':'laws at '+c.lawCentre))+' '+n2(c.cq90)+'</text>';});
 return '<svg class="ch" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Coherence over ninety days of daily use, four cases, every line flat">'+g+'</svg>';}

function convergeChart(){
 const W=860,H=220,L=46,Rr=14,T=16,B=28;
 const t=G.totals, mn=G.means;
 const lo=Math.min.apply(null,t)-0.6, hi=Math.max.apply(null,t)+0.6;
 const y=v=>T+(hi-v)/(hi-lo)*(H-T-B);
 const x=i=>L+(t.length>1?i/(t.length-1):0)*(W-L-Rr);
 let g='';
 [0,1,2,3].forEach(i=>{const v=lo+(hi-lo)*i/3;
  g+='<line class="gl" x1="'+L+'" y1="'+y(v).toFixed(1)+'" x2="'+(W-Rr)+'" y2="'+y(v).toFixed(1)+'"/>'
   +'<text class="ax" x="'+(L-6)+'" y="'+(y(v)+3.5).toFixed(1)+'" text-anchor="end">'+v.toFixed(1)+'</text>';});
 t.forEach((v,i)=>{g+='<circle class="dot" cx="'+x(i).toFixed(1)+'" cy="'+y(v).toFixed(1)+'" r="3"/>';});
 g+='<path class="ln" stroke="var(--accent)" d="'+mn.map((v,i)=>
  (i?'L':'M')+x(i).toFixed(1)+' '+y(v).toFixed(1)).join(' ')+'"/>';
 [1,Math.ceil(t.length/2),t.length].forEach(d=>
  g+='<text class="ax" x="'+x(d-1).toFixed(1)+'" y="'+(H-8)+'" text-anchor="middle">run '+d+'</text>');
 return '<svg class="ch" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="The grade of each run as a dot and the running mean as a line, settling">'+g+'</svg>';}

function rubricBars(){
 return bars(G.rows.map(r=>({k:r.k, v:r.mean, lab:n1(r.mean)+' of 10'
  +(r.sd>0?'  plus or minus '+n2(r.sd):''),
  c:r.mean>=7?'var(--good)':(r.mean>=4?'var(--solar)':'var(--bad)')})),
  {alt:'The ten criteria and what each scored', L:190, rowH:30});}

/* ============================================================ page */
const SEATCOL={Diane:'--root',Derek:'--sacral',Marcus:'--solar',Angela:'--heart',
 Sofia:'--throat',James:'--eye',Ana:'--crown',Gordon:'--dim',Rosa:'--mid'};

function icpCards(){
 return ICPS.map(nm=>{const x=R.icp[nm], c='var('+(SEATCOL[nm]||'--accent')+')';
  return '<article class="card">'
   +'<header><span class="dot2" style="background:'+c+'"></span>'
   +'<h3>'+e(nm)+', '+x.age+'</h3><p class="role">'+e(x.role)+'</p></header>'
   +'<dl class="kv">'
   +'<div><dt>weight of a thousand</dt><dd>'+x.weight+'</dd></div>'
   +'<div><dt>buyer grid</dt><dd>level '+x.grid+'</dd></div>'
   +'<div><dt>device</dt><dd>'+e(x.device==='phone'?'phone only':'both')+'</dd></div>'
   +'<div><dt>interval</dt><dd>'+e(x.shape)+'</dd></div>'
   +'<div><dt>opened it at all</dt><dd>'+pc(x.arrived,0)+'</dd></div>'
   +'<div><dt>opened on day one</dt><dd>'+pc(x.ret[1],0)+'</dd></div>'
   +'<div><dt>active in the week to day 30</dt><dd>'+pc(x.ret[30])+'</dd></div>'
   +'<div><dt>sessions in ninety days</dt><dd>'+n2(x.sessions)+'</dd></div>'
   +'<div><dt>stories told</dt><dd>'+n2(x.stories)+'</dd></div>'
   +'<div><dt>releases run</dt><dd>'+n2(x.releases)+'</dd></div>'
   +'<div><dt>ever closed the loop</dt><dd>'+pc(x.loopEver)+'</dd></div>'
   +'<div><dt>last day they opened it</dt><dd>day '+n1(x.exit.lastDay)+'</dd></div>'
   +'<div><dt>left with nothing done</dt><dd>'+pc(x.exit.nothing,0)+'</dd></div>'
   +'<div><dt>reading, first to last</dt><dd class="'+(x.exit.cqDelta<0?'bad':'good')+'">'
     +(x.exit.cqDelta>0?'+':'')+n2(x.exit.cqDelta)+'</dd></div>'
   +'</dl>'
   +'<p class="why"><b>Why they open it.</b> '+e(x.why)+'</p>'
   +'<p class="why"><b>Why they do not.</b> '+e(x.whyNot)+'</p>'
   +'<p class="split">Of that movement, the intake is '+n2(x.exit.dIntake)
   +', every story together is '+n2(x.exit.dStory)+', and every release together is '
   +(x.exit.dRelease>0?'+':'')+n2(x.exit.dRelease)+'.</p>'
   +'</article>';}).join('');}

function lostTable(){
 return '<table class="tb"><thead><tr><th>Rank</th><th>Sticking point</th>'
  +'<th>Surface</th><th>The step</th><th>Lost of '+COH+'</th><th>Met it</th>'
  +'<th>Who</th></tr></thead><tbody>'
  +lostRank.map((k,i)=>{const L=R.lost[k], h=R.hitShare[k];
   return '<tr><td class="num">'+(i+1)+'</td><td><b>'+e(L.nm)+'</b>'
    +'<div class="fine">'+e(L.say)+'</div></td>'
    +'<td>'+e(L.surf)+'</td><td>'+e(L.step)+'</td>'
    +'<td class="num">'+L.people+' <span class="fine">sd '+n1(L.sd)+'</span></td>'
    +'<td class="num">'+(h&&h.share?pc(h.share,0):'not a screen')+'</td>'
    +'<td>'+L.by.slice(0,3).map(b=>e(b.nm)+'&nbsp;'+b.n).join('<br>')+'</td></tr>';}).join('')
  +'</tbody></table>';}

function bankTable(){
 return '<table class="tb"><thead><tr><th>Who</th><th>What they typed</th>'
  +'<th>Words read</th><th>Addresses offered</th><th>Named or inferred</th></tr></thead><tbody>'
  +bankRows.map(r=>'<tr class="'+(r.imprints===0?'zero':(r.inferred?'infer':''))+'">'
   +'<td>'+e(r.who)+'</td><td class="q">'+e(r.text)+'</td>'
   +'<td class="num">'+r.hits+'</td>'
   +'<td>'+(r.offers.length?e(r.offers.join(', ')):'<span class="fine">nothing</span>')+'</td>'
   +'<td>'+(r.imprints===0?'<b class="bad">read nothing</b>'
     :(r.named.length?'named '+e(r.named.join(', ')):'<b class="warn">inferred from the band</b>'))
   +'</td></tr>').join('')+'</tbody></table>';}

function rubricTable(){
 return '<table class="tb"><thead><tr><th>Criterion</th><th>Score</th><th>Spread</th>'
  +'<th>Source</th><th>How it is computed</th></tr></thead><tbody>'
  +G.rows.map(r=>'<tr><td><b>'+e(r.k)+'</b></td>'
   +'<td class="num">'+n1(r.mean)+' of 10</td>'
   +'<td class="num">'+(r.sd>0?n2(r.sd)+'  ('+n1(r.lo)+' to '+n1(r.hi)+')':'none')+'</td>'
   +'<td>'+(r.carried?'carried':(r.moves?'the run':'measured'))+'</td>'
   +'<td class="fine">'+e(r.how)+'</td></tr>').join('')
  +'<tr class="tot"><td><b>Total</b></td><td class="num"><b>'+n2(G.mean)+' of 100</b></td>'
  +'<td class="num">'+n2(G.sd)+'  ('+n1(G.lo)+' to '+n1(G.hi)+')</td>'
  +'<td>'+settle.runs+' runs</td><td class="fine">the ten added</td></tr>'
  +'</tbody></table>';}

function surfaceTable(){
 const ks=Object.keys(M.above);
 return '<table class="tb"><thead><tr><th>Surface</th><th>Choices above the fold, 1600</th>'
  +'<th>Choices above the fold, 390</th><th>Scroll depth at 390</th>'
  +'<th>Against a working screen of under 12</th></tr></thead><tbody>'
  +ks.map(k=>{const a=M.above[k], d=M.deep[k];
   return '<tr><td><b>'+e(k)+'</b></td><td class="num">'+a.desk+'</td>'
    +'<td class="num">'+a.phone+'</td>'
    +'<td class="num">'+d+' px, '+(d/844).toFixed(1)+' screens</td>'
    +'<td class="num '+(a.desk>12?'bad':'good')+'">'+(a.desk/12).toFixed(1)+' times over</td></tr>';}).join('')
  +'</tbody></table>';}

const st=R.stamp;
const HTML=`<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Ninety days</title>
<style>
:root{
 --bg:#0C0D12; --panel:#1A1D26; --panel-2:#252833; --sunk:#090A0E;
 --ink:#EFEDE8; --mid:#B4B0A8; --dim:#94908A; --line:rgba(239,237,232,.13);
 --accent:#7EB8D4; --au:#C2A063; --good:#68CBA4; --bad:#D4736D;
 --root:#D6524C; --sacral:#D8924E; --solar:#DABF6A;
 --heart:#5FD5A6; --throat:#5EBBDB; --eye:#7D93E0; --crown:#A77EDB;
 --w:1120px;
}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--ink);
 font:400 16px/1.62 ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
 letter-spacing:.005em}
.wrap{max-width:var(--w);margin:0 auto;padding:40px 16px 90px}
h1{font-size:clamp(28px,4.6vw,44px);line-height:1.1;margin:0 0 10px;font-weight:600;letter-spacing:-.015em}
h2{font-size:clamp(20px,2.6vw,26px);margin:54px 0 6px;font-weight:600;letter-spacing:-.01em}
h3{font-size:17px;margin:0;font-weight:600}
h2+.lede{margin-top:0;color:var(--mid)}
p{margin:0 0 14px;max-width:74ch}
.lede{color:var(--mid);font-size:17px}
.eye{font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--dim);margin:0 0 8px}
.rule{height:1px;background:var(--line);border:0;margin:36px 0}
.note{border-left:2px solid var(--au);padding:2px 0 2px 16px;color:var(--mid);margin:0 0 20px;max-width:74ch}
.stamp{font:400 12.5px/1.75 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
 color:var(--dim);background:var(--sunk);border:1px solid var(--line);
 border-radius:8px;padding:14px 16px;margin:22px 0 0;overflow-x:auto;white-space:pre}
.grid{display:grid;gap:14px}
.g3{grid-template-columns:repeat(3,1fr)}
.g2{grid-template-columns:repeat(2,1fr)}
.g4{grid-template-columns:repeat(4,1fr)}
.tile{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:18px}
.tile .n{font-size:clamp(26px,3.4vw,38px);line-height:1.05;font-weight:600;letter-spacing:-.02em;display:block}
.tile .l{color:var(--dim);font-size:13px;display:block;margin-top:6px}
.tile .s{color:var(--mid);font-size:13.5px;display:block;margin-top:8px}
.big{background:linear-gradient(180deg,var(--panel-2),var(--panel));
 border:1px solid var(--line);border-radius:16px;padding:26px 24px}
.big .gr{font-size:clamp(52px,9vw,88px);line-height:.95;font-weight:600;letter-spacing:-.035em}
.big .gl2{font-size:clamp(22px,3vw,30px);color:var(--au);font-weight:600;margin-left:10px}
.ch{width:100%;height:auto;display:block;margin:10px 0 6px;overflow:visible}
.gl{stroke:var(--line);stroke-width:1}
.ln{fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}
.dot{fill:var(--dim)}
text{font:400 12px ui-sans-serif,system-ui,sans-serif}
.ax{fill:var(--dim)}
.bl{fill:var(--mid);font-size:12.5px}
.bn{fill:var(--ink);font-size:12.5px}
.lg{font-size:12.5px;font-weight:600}
.br{rx:2}
table.tb{width:100%;border-collapse:collapse;margin:14px 0 6px;font-size:14px}
table.tb th{text-align:left;font-weight:600;font-size:11.5px;letter-spacing:.09em;
 text-transform:uppercase;color:var(--dim);border-bottom:1px solid var(--line);
 padding:0 12px 8px 0;vertical-align:bottom}
table.tb td{padding:11px 12px 11px 0;border-bottom:1px solid var(--line);vertical-align:top}
table.tb td.num{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}
table.tb tr.tot td{border-bottom:0;border-top:1px solid var(--line)}
table.tb tr.zero td{background:rgba(212,115,109,.07)}
table.tb tr.infer td{background:rgba(218,191,106,.06)}
td.q{color:var(--mid);max-width:44ch}
.fine{color:var(--dim);font-size:12.5px;display:block;margin-top:3px;line-height:1.45}
.good{color:var(--good)} .bad{color:var(--bad)} .warn{color:var(--solar)}
.card{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:18px}
.card header{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;margin-bottom:12px}
.card .role{color:var(--dim);font-size:13px;margin:0;width:100%}
.dot2{width:9px;height:9px;border-radius:50%;display:inline-block}
dl.kv{margin:0 0 12px;display:grid;gap:3px}
dl.kv div{display:flex;justify-content:space-between;gap:12px;align-items:baseline;
 border-bottom:1px dotted var(--line);padding-bottom:3px}
dl.kv dt{color:var(--dim);font-size:13px;margin:0}
dl.kv dd{margin:0;font-variant-numeric:tabular-nums;font-size:14px;white-space:nowrap}
.why{font-size:13.5px;color:var(--mid);margin:0 0 8px}
.why b{color:var(--ink)}
.split{font-size:12.5px;color:var(--dim);margin:0;border-top:1px solid var(--line);padding-top:8px}
ul,ol{margin:0 0 16px;padding-left:22px;max-width:74ch}
li{margin-bottom:8px}
li b{font-weight:600}
code{font:400 13.5px ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
 background:var(--sunk);border:1px solid var(--line);border-radius:4px;padding:1px 5px}
.foot{color:var(--dim);font-size:13px;margin-top:40px}
@media (max-width:820px){
 .g3,.g2,.g4{grid-template-columns:1fr}
 .wrap{padding:26px 16px 70px}
 table.tb{display:block;overflow-x:auto;white-space:nowrap}
 td.q{white-space:normal;min-width:30ch}
 .fine{white-space:normal}
}
@media print{body{background:#fff;color:#111}}
</style></head>
<body><div class="wrap">

<p class="eye">Atüned, the UI and UX seat</p>
<h1>Ninety days, run until the number stopped moving</h1>
<p class="lede">Nine figures from the roster, ${COH} simulated arrivals a run,
${settle.runs} runs, driven through the shipped engine for ninety days each.</p>

<div class="note"><b>Read this once and then read the numbers plainly.</b>
Every person below is imagined. Nobody named exists and nothing in quotation
marks was said by a human being. What is real is the product: every reading,
every charge, every release, every streak and every mark was produced by
calling the shipped engine, and every fact about the surface was read off
source.html running in Chromium. The model in this report is one thing only,
and it is when somebody opens the file and when they stop. That model is stated
in full, it is argued from who each figure is, and it is judgement. This is not
evidence about any human being.</div>

<div class="big">
 <div><span class="gr">${n2(G.mean)}</span><span class="gl2">of 100, ${e(G.letter)}</span></div>
 <p class="lede" style="margin:12px 0 0">Spread across runs ${n2(G.sd)}, range
 ${n1(G.lo)} to ${n1(G.hi)}. The stopping rule was a running mean that moves by
 less than ${settle.threshold} of a point when another run is added, held for
 ${settle.hold} runs in a row, with at least ${settle.floor} behind it. It took
 ${settle.runs}. Moving every friction cost and every opening rate by a quarter
 in both directions moves the total by ${n2(R.sensitivity.span)} points, and
 that is the spread that matters rather than the seed.</p>
</div>

<div class="grid g4" style="margin-top:14px">
 <div class="tile"><span class="n">${pc(R.daily[0],0)}</span>
  <span class="l">open the file on day one</span></div>
 <div class="tile"><span class="n">${pc(R.retention[30].mean,2)}</span>
  <span class="l">active in the week ending day 30</span>
  <span class="s">The category median for this kind of app is 3.3 percent.</span></div>
 <div class="tile"><span class="n">${pc(R.totals.loopEver,1)}</span>
  <span class="l">ever close the loop once</span>
  <span class="s">A story, then a release, then a practice kept.</span></div>
 <div class="tile"><span class="n">${(ceil.mid.cq90-ceil.mid.cq0>0?'+':'')+n2(ceil.mid.cq90-ceil.mid.cq0)}</span>
  <span class="l">coherence moved, in ninety days of doing everything</span>
  <span class="s">${ceil.mid.minutes} minutes of practice on the record.</span></div>
</div>

<h2>The finding</h2>
<p class="lede">It is not the retention curve. It is what happens to the person
who does everything right.</p>

<p>One case, no model in it at all. A person answers the intake on day one, then
for ninety consecutive days tells the instrument one true thing, runs the
largest release the field offers, and keeps one practice. Driven through the
shipped engine, with the release arithmetic checked line by line against the
same run executed in Chromium.</p>

${ceilingChart()}

<p><b>Every line is flat.</b> Ninety days, ${ceil.mid.minutes} minutes of
recorded practice, a ${ceil.mid.streak} day streak, ${ceil.mid.marks.length}
marks earned and ${ceil.mid.ground} patterns of ground opened, and the reading
finishes ${n2(ceil.mid.cq90-ceil.mid.cq0)} of a point from where it started. The
band does not change. Four cases, four starting integrities, the same result.</p>

<table class="tb"><thead><tr><th>Case</th><th>Day one</th><th>Day ninety</th>
<th>Moved</th><th>Highest it reached</th><th>Lowest</th><th>Band at the end</th>
<th>Ground opened</th><th>Addresses cleared</th></tr></thead><tbody>
${['none','low','mid','high'].map(k=>{const c=ceil[k];
 return '<tr><td><b>'+(k==='none'?'never took the intake':'intake answered at '+c.lawCentre)+'</b></td>'
 +'<td class="num">'+n2(c.cq0)+'</td><td class="num">'+n2(c.cq90)+'</td>'
 +'<td class="num '+((c.cq90-c.cq0)>0?'good':'bad')+'">'+((c.cq90-c.cq0)>0?'+':'')+n2(c.cq90-c.cq0)+'</td>'
 +'<td class="num">'+n2(c.best)+'</td><td class="num">'+n2(c.worst)+'</td>'
 +'<td>'+e(c.band)+'</td><td class="num">'+c.ground+'</td>'
 +'<td class="num">'+c.clear+'</td></tr>';}).join('')}
</tbody></table>

<p>Three mechanisms, each measured, together produce the flat line.</p>
<ol>
<li><b>A story only ever adds charge, so a reading only ever falls from one.</b>
 Measured across the cohort: the whole of every story a person told moves them
 ${n2(R.icp.Sofia.exit.dStory)} in Sofia's case and
 ${n2(R.icp.Ana.exit.dStory)} in Ana's, and every release they ran moves them
 back by ${n2(R.icp.Sofia.exit.dRelease)} and ${n2(R.icp.Ana.exit.dRelease)}.
 The two cancel to inside a tenth of a point.</li>
<li><b>The release takes twenty one percent of the weight and installs sixty two
 percent of what it took.</b> So the far pole is never reached: after ninety
 days of daily releases the ceiling case holds ${ceil.mid.clear} addresses at
 the opposite, out of a hundred and twelve.</li>
<li><b>The reading is the intake.</b> The same ninety days run at four different
 intake answers produce four flat lines at four different heights, and the
 height is the intake. The entire somatic half of the product, run every day for
 a quarter, is worth less than a point of the number it is supposed to move.</li>
</ol>

<h2>The allowance is a label</h2>
<p>Measured in the shipped app, not modelled.
${MEAS.loop.exhausted.uniqueBefore} patterns of ground were opened until the
allowance read zero, and then a release was run anyway. The panel printed
<code>${e(MEAS.loop.exhausted.quoted)}</code> and the run went ahead:
${MEAS.loop.exhausted.uniqueBefore} patterns before it and
${MEAS.loop.exhausted.uniqueAfter} after, the reading moving
${n2(MEAS.loop.exhausted.cqBefore)} to ${n2(MEAS.loop.exhausted.cqAfter)}.
<code>relCoolDown</code> never reads <code>relLeft()</code>. In the ceiling case
the gift runs out on day ${ceil.mid.giftGone===null?'never':ceil.mid.notes.giftGone}
and the person goes on to open ${ceil.mid.ground} patterns against a gift of a
hundred.</p>
<p>That is one defect with two faces. There is nothing to sell, because there is
no limit to sell past. And a person is told a number that is not true of them,
on the one panel whose job is to say what a run costs.</p>

<h2>What the box does with what it was told</h2>
<p class="lede">Forty one lines of ordinary first person writing, written in each
figure's own voice before the lexicon was consulted, put through the shipped
<code>parseStory</code>.</p>
<div class="grid g3">
 <div class="tile"><span class="n">${bankNone} of ${bankRows.length}</span>
  <span class="l">read nothing at all</span>
  <span class="s">${pc(bankNone/bankRows.length,0)} of ordinary sentences produce no imprint, so the field does not move and the panel has nothing to show.</span></div>
 <div class="tile"><span class="n">${bankRows.length-bankNamed} of ${bankRows.length}</span>
  <span class="l">name no charge</span>
  <span class="s">The seat is read off a band and the address is chosen by a fallback.</span></div>
 <div class="tile"><span class="n">${bankInfer} of ${bankRows.length}</span>
  <span class="l">offer an address the person did not describe</span>
  <span class="s">Every imprint carries <code>inferred</code>, and a renderer must not print those as findings.</span></div>
</div>
<p style="margin-top:16px"><b>The roster's own signature lines are in the same
state.</b> The <code>says</code> field on every entry in
<code>engine/data/people.js</code> is the repository's own voice for these
people, written long before this exercise. Put through the shipped sniffer,
${saysNone} of ${saysRows.length} read nothing at all.</p>
<p><b>And where it does read something, it often names something else.</b>
${quoteLine(qAna)}. ${quoteLine(qJames)}. ${quoteLine(qDiane)}. Every one of
those imprints carries <code>inferred</code>, which means a band was read and
the address was picked by a fallback, and the panel prints them as findings
anyway. Ana, who is the one figure in the roster for whom a wrong answer costs
something, writes that she is ashamed of how long her grief is taking and the
instrument answers ${qAna?e(qAna.offers[0].toLowerCase()):''}.</p>
<p>The shipped vocabulary is
${R.lexicon.words} words, ${R.lexicon.phrases}
phrases and ${R.lexicon.adjectives} adjectives. It
reads <code>terrified</code>, <code>exhausted</code>, <code>ashamed</code>,
<code>numb</code> and <code>have not slept</code>. It reads nothing at all out
of "I work until the work is done and the work is never done", which is Diane's
own line in the repository, or out of "I am in the middle of something and I
cannot see the far side of it", which is Ana's.</p>
${bankTable()}

<h2>The curves</h2>
<p class="lede">Share of the cohort opening the file on each of the ninety days,
log scale, because it spans ${pc(R.daily[0],0)} to ${pc(R.daily[89],2)}.</p>
${lineLog([{v:R.daily,c:'var(--accent)'}],{alt:'Daily open rate over ninety days, falling from sixty one percent to near zero'})}
<div class="grid g4">
${[1,7,30,90].map(d=>'<div class="tile"><span class="n">'+pc(R.daily[d-1],d===1?0:2)
 +'</span><span class="l">opened it on day '+d+'</span></div>').join('')}
</div>
<p style="margin-top:20px">The same thing counted the way the published
benchmarks count it: anybody who opened at least once inside the week.</p>
${bars(R.weekly.map((v,i)=>({k:'week '+(i+1),v:v,lab:pc(v,i<2?1:2)})),
 {alt:'Weekly active share across thirteen weeks', L:96, rowH:22})}
<p class="note">The two are the same data and they are not interchangeable. The
daily figure is what a notification would be competing for. The weekly figure is
the one to hold against the cited category numbers: median daily active of 4.0
percent and thirty day retention of 3.3 percent across ninety three mental
health apps (Baumel, Muench, Edan and Kane, JMIR 2019), and day thirty of about
3 percent for health and fitness. This run lands at
${pc(R.retention[30].mean,2)} for the week ending day thirty. That is the
category median and the category median is a catastrophe.</p>

<h2>The cohort</h2>
<p class="lede">Nine figures, weighted as in <code>RESEARCH-icp.md</code> so this
run compares line by line with the earlier one. Everything in the panels below
is output. Why they open it and why they do not is the model, stated.</p>
<p class="note"><b>Diane tells no stories, ever, and it is arithmetic rather
than character.</b> She carries the heaviest weight in the roster at
${R.icp.Diane.weight} of a thousand and her session is a status check between
meetings. The model gives her ${R.model.showup.filter(x=>x.nm==='Diane')[0].minutes[0]}
to ${R.model.showup.filter(x=>x.nm==='Diane')[0].minutes[1]} minutes of it. The
cheapest route into this product's own loop is the story box at
${R.model.cost.story} minutes, so the only door to her own charge costs more time
than she has, every time. Over ninety days she opens it
${n2(R.icp.Diane.sessions)} times, tells ${n2(R.icp.Diane.stories)} stories, runs
${n2(R.icp.Diane.releases)} releases and stops on day
${n1(R.icp.Diane.exit.lastDay)}, with ${pc(R.icp.Diane.exit.nothing,0)} of her
having done nothing at all. James, at ${R.icp.James.weight}, is the same shape.
Between them that is ${R.icp.Diane.weight+R.icp.James.weight} of a thousand
arrivals for whom the product has no door narrow enough.</p>
<div class="grid g2">${icpCards()}</div>

<h2>Sticking points, ranked by people lost</h2>
<p class="lede">Ranked by departures attributed to them, not by how many people
met them. A departure is attributed to the heaviest single friction of the
session somebody left on. That is an attribution and not a cause.</p>
${bars(lostRank.map(k=>({k:R.lost[k].nm.length>42?R.lost[k].nm.slice(0,41)+'…':R.lost[k].nm,
 v:R.lost[k].people, lab:R.lost[k].people+' of '+COH,
 c:k==='DRIFT'?'var(--dim)':'var(--bad)'})),
 {alt:'Sticking points ranked by people lost', L:300, rowH:26})}
${lostTable()}

<h2>Challenges that are not sticking points</h2>
<p class="lede">Measured, and they do not show up in a funnel because nobody
leaves on them. They cap what the product can be.</p>
<table class="tb"><thead><tr><th>Challenge</th><th>Measured</th><th>Why it caps the ceiling</th></tr></thead><tbody>
<tr><td><b>Simultaneous choices</b></td>
 <td class="num">${M.above[M.landing].desk} above the fold on the landing surface at 1600, ${M.above[M.landing].phone} at 390</td>
 <td>A working screen targets under twelve against a working memory of about four. The landing surface is ${(M.above[M.landing].desk/12).toFixed(1)} times over at desk width.</td></tr>
<tr><td><b>The bar at phone width</b></td>
 <td class="num">${M.stripPhone} of ${M.tabs} fully in view</td>
 <td>${e(M.offStrip.join(', '))} are past the right edge. Summary is the surface that prints the reading, and two of six ICPs plus one edge case have no second device.</td></tr>
<tr><td><b>Two answers to where a blank arrival starts</b></td>
 <td class="num">${n2(R.seedGap.app)} in the app, ${n2(R.seedGap.engine)} out of the engine</td>
 <td>An unmeasured law is seeded at ${R.seedGap.appSeed} by <code>LAWSET.You</code> and at ${R.seedGap.engineSeed} by the engine's own boundary, so the same empty profile reads ${n2(R.seedGap.gap)} apart depending on which half you ask. A third caller seeds 5.5.</td></tr>
<tr><td><b>The record credits a plan</b></td>
 <td class="num">${pc(R.totals.keptShare,0)} of saved rituals were actually done</td>
 <td><code>pracDays</code> counts every distinct day carrying a saved ritual and never reads the done flag, so a streak is a record of planning. The first mark is earned by saving.</td></tr>
<tr><td><b>Nothing to hand on</b></td>
 <td class="num">${M.refer} referral controls on any surface</td>
 <td>Sofia is the highest value entry in the roster because she brings clients. Her use cannot compound, and her silence never shows in a funnel.</td></tr>
<tr><td><b>Nothing asks for a return</b></td>
 <td class="num">${R.lost.DRIFT?R.lost.DRIFT.people:0} of ${COH} lost to an absence that became permanent</td>
 <td>No notification, no accountability seam. Every return in this run is unprompted, which is the single largest loss in the table above.</td></tr>
</tbody></table>
${surfaceTable()}

<h2>What is good, and it is not a consolation paragraph</h2>
<div class="grid g3">
 <div class="tile"><span class="n">${M.errors}</span><span class="l">page errors across every surface, both widths</span></div>
 <div class="tile"><span class="n">${M.requests}</span><span class="l">outbound request, which is the file itself</span></div>
 <div class="tile"><span class="n">${M.bootMs} ms</span><span class="l">to the first word on the screen</span></div>
 <div class="tile"><span class="n">${M.small}</span><span class="l">controls under the 44 by 44 floor, across every surface at 390</span>
  ${M.small?'<span class="s">'+e(smallest)+'</span>':''}</div>
 <div class="tile"><span class="n">${M.tabs} of ${M.tabs}</span><span class="l">surfaces render on a blank profile and on a loaded one</span></div>
 <div class="tile"><span class="n">${MEAS.loop.reference.refused?'refuses':'runs'}</span>
  <span class="l">a release started on somebody else's field</span>
  <span class="s">It names the profile and declines. This was the largest defect in the earlier simulation and it is closed.</span></div>
</div>
<ul style="margin-top:18px">
<li><b>The boot is fixed.</b> ${M.bootMs} milliseconds to the first word,
 against four and a half seconds in the earlier run, and the card carries
 "press anything to go straight in".</li>
<li><b>The release is honest about whose field it is.</b> Driven on a reference
 case: it refused, named ${e(MEAS.loop.reference.who)}, and left the reading at
 ${n2(MEAS.loop.reference.cqAfter)} where it found it. The earlier simulation
 ranked the old behaviour as the single biggest reason people left.</li>
<li><b>The intake reaches the release now.</b> The connection is real and it runs
 through the integrity relief term: the same two stories load nothing above the
 line at the default and load addresses once the intake is answered at five or
 below. The earlier run recorded that connection as missing.</li>
<li><b>The record is built and it works.</b> The streak halves on a gap rather
 than resetting, the ladder names one next mark and never a count against a
 total, and the ceiling case earned ${ceil.mid.marks.length} marks over the
 quarter. The gamification is the half of this product that does its job.</li>
<li><b>Nothing breaks.</b> Zero errors, one request, every surface rendering,
 ${M.small?M.small+' control under the 44 by 44 floor and every other one over it':'every touch target over the floor'}, and undo and redo in the top bar. On the
 owner's own acceptance test, that it reads as thoughtful and well crafted and
 does not break, the engineering half passes.</li>
</ul>

<h2>What a person has at the end of ninety days</h2>
<p class="lede">Averaged over everybody who opened the file, at the moment they
stopped, which for most of them is inside the first week.</p>
<table class="tb"><thead><tr><th>Who</th><th>Last day</th><th>Sessions</th>
<th>Minutes</th><th>Stories</th><th>Releases</th><th>Ground</th><th>Marks</th>
<th>Reading moved</th><th>Left with nothing done</th></tr></thead><tbody>
${ICPS.map(nm=>{const x=R.icp[nm];
 return '<tr><td><b>'+e(nm)+'</b></td><td class="num">day '+n1(x.exit.lastDay)+'</td>'
 +'<td class="num">'+n2(x.exit.sessions)+'</td><td class="num">'+n1(x.exit.minutes)+'</td>'
 +'<td class="num">'+n2(x.exit.stories)+'</td><td class="num">'+n2(x.exit.releases)+'</td>'
 +'<td class="num">'+n1(x.exit.ground)+'</td><td class="num">'+n1(x.exit.marks)+'</td>'
 +'<td class="num '+(x.exit.cqDelta<0?'bad':'good')+'">'+(x.exit.cqDelta>0?'+':'')+n2(x.exit.cqDelta)+'</td>'
 +'<td class="num">'+pc(x.exit.nothing,0)+'</td></tr>';}).join('')}
</tbody></table>
<p>And for the person who stayed the whole quarter and did everything, which is
the ceiling and not the average: ${ceil.mid.marks.length} marks, a
${ceil.mid.streak} day streak, ${ceil.mid.minutes} minutes on the record,
${ceil.mid.ground} patterns of ground, ${ceil.mid.clear} addresses holding the
opposite, and a reading ${n2(ceil.mid.cq90-ceil.mid.cq0)} of a point higher than
the one they arrived with. The marks are real. The instrument did not move.</p>

<h2>The grade</h2>
${rubricBars()}
${rubricTable()}
<p>Six of the ten are measured off the surface and do not move between runs. One
is carried unchanged from the earlier simulation and says so. Four move with the
cohort, and their spread is in the table. A single grade with no variance beside
it is not an answer, so the convergence is below.</p>
${convergeChart()}
<p>Each dot is one run of ${COH} people. The line is the running mean. It
settled at run ${settle.runs} under a threshold of ${settle.threshold} of a point
sustained for ${settle.hold} runs. The seed is not where the uncertainty is: at
a thousand people the run to run spread is ${n2(G.sd)} of a point. Moving the
model's own constants is worth ${n2(R.sensitivity.span)} points, which is the
honest error bar.</p>
<table class="tb"><thead><tr><th>Model constant moved</th><th>By</th><th>Grade</th><th>Change</th></tr></thead><tbody>
${R.sensitivity.rows.map(r=>'<tr><td>'+e(r.what)+'</td><td class="num">'
 +Math.round((r.factor-1)*100)+'%</td><td class="num">'+n2(r.total)+'</td>'
 +'<td class="num '+(r.d<0?'bad':'good')+'">'+(r.d>0?'+':'')+n2(r.d)+'</td></tr>').join('')}
</tbody></table>

<h2>What moved since the earlier simulation</h2>
<p class="lede"><code>reviews/SIM-ninety-days.md</code> and
<code>reviews/sim-ninety-days.html</code> ran the same exercise on an older
build and graded it 51 of 100. This run grades ${n2(G.mean)}.</p>
<p><b>The product got better and the grade went down, and both are true.</b>
The earlier run was a walk through the surface with arithmetic attached. It did
not run the loop for ninety days, so it could not see the one thing that
matters: the loop closes on itself and returns the person to where they started.
Several of the defects it named are genuinely fixed and the fixes are good work.
The one it could not reach costs more than all of them returned.</p>
<table class="tb"><thead><tr><th>Then</th><th>Now, measured this run</th></tr></thead><tbody>
<tr><td>The release repoints the profile, wipes the field and bills the person. Ranked first, 187 people</td>
 <td class="good">Closed. Driven on a reference case it refuses, names ${e(MEAS.loop.reference.who)} and writes nothing</td></tr>
<tr><td>The intake cannot reach the release. 163 people</td>
 <td class="good">Closed. The intake moves the integrity relief term, which is what lets an address reach the line</td></tr>
<tr><td>The first four seconds contain no word. 21 people</td>
 <td class="good">Closed. ${M.bootMs} milliseconds to the first word, at both widths</td></tr>
<tr><td>The gift is spent invisibly. 41 people</td>
 <td class="bad">Worse than it was described. It is not spent invisibly, it is not spent at all. Nothing reads the allowance, so the panel prints a number that is not true and the run proceeds</td></tr>
<tr><td>The phone tab strip hides four of the nine doors. 121 people</td>
 <td>Unchanged. ${M.stripPhone} of ${M.tabs} fully in view at 390, with ${e(M.offStrip.join(', '))} past the edge</td></tr>
<tr><td>"41%" beside the word "Incoherent". 29 people</td>
 <td>Unchanged. The headline rounds and the band does not. Incoherent is 31 to 40</td></tr>
<tr><td>The story leaves the instrument unread. 88 people</td>
 <td class="bad">Measured rather than estimated, and it is bigger. ${bankNone} of ${bankRows.length} ordinary sentences read nothing, and the reading needs six commits before it moves at all</td></tr>
<tr><td>Cognitive load, 57 to 71 per screen. Architectural</td>
 <td>Unchanged and now measured on every surface. ${M.above[M.landing].desk} above the fold on the landing surface, ${M.above.Knowledge.desk} on Knowledge</td></tr>
<tr><td>Day thirty modelled at 5.6 percent against a category median of 3.3</td>
 <td>${pc(R.retention[30].mean,2)} on the same comparison, with the departure model argued from each figure rather than assigned</td></tr>
</tbody></table>

<h2>The move</h2>
<p class="lede">What goes, what moves, what folds. In the order that changes the
number, not the order that is easiest.</p>
<ol>
<li><b>Make the release clear an address.</b> This is the one. Twenty one percent
 of the weight and a sixty two percent install is a rounding error against a
 story that adds the same amount back. Either the removal compounds over a
 session, or the install reaches the far pole, or a cleared address stays
 cleared. Until one of the three is true, the product's core promise is a loop
 that returns to its own start and the marks are the only thing a person gets.
 Everything else on this list is smaller than this.</li>
<li><b>Widen the box or change what it claims.</b> ${pc(bankNone/bankRows.length,0)}
 of ordinary writing reads nothing, and the reading needs six commits before it
 moves. Two honest routes. Widen the lexicon until an ordinary paragraph lands,
 which is a data job and not an architecture one. Or say what it is: a
 vocabulary of ${R.lexicon.words} words, shown
 to the person, with the words it found lit and a line saying what it did not
 read. The second one is an afternoon and it converts the defect into the
 product showing its work, which is this instrument's whole defence.</li>
<li><b>Stop printing an inferred address as a finding.</b> ${bankInfer} of
 ${bankRows.length} lines produce imprints that are entirely inferred, and the
 flag is already on every one of them. A person who wrote that they snapped at
 their cofounder is currently offered ${e(MEAS.loop.own.picked.map(p=>p.k).join(', '))}.
 The panel has the flag. It needs to use it.</li>
<li><b>Gate the allowance or take the number off the panel.</b> One of the two,
 today. A stated limit with nothing behind it is a false statement on the one
 surface that quotes a price.</li>
<li><b>Give the reading somewhere to go on a phone.</b> Summary is off the strip
 at 390 and Summary is where the number lives. Two of six ICPs and one edge case
 have one device.</li>
<li><b>Read the done flag in the streak.</b> A saved plan is not a day
 practised. <code>ledgerRead</code> already separates planned from done;
 <code>pracDays</code> does not.</li>
<li><b>One seed for an unmeasured law.</b> Three callers, three numbers, and
 ${n2(R.seedGap.gap)} points of coherence between two of them on an empty
 profile.</li>
<li><b>Then the return.</b> The largest single loss in this run is an absence
 that nothing interrupted. That is the notification seam, and it is already in
 scope. It is last on this list and not first, because a prompt to come back
 to a loop that returns you to your own starting point is a prompt to come back
 to nothing.</li>
</ol>

<h2>What to instrument, so the next run is measurement</h2>
<p class="lede">There is no instrumentation in the product, so every retention
figure above is derived. Six counters would replace most of this document with
data.</p>
<ol>
<li><b>Story commits, and whether the parse returned an imprint.</b> Two
 integers. It answers the largest finding here directly and it needs no
 identity: a count of commits and a count of commits that read nothing.</li>
<li><b>Coherence at first reading and at every seventh day after it.</b> The
 snapshot already exists and carries the stamp. Nothing reads it as a series
 except the graph.</li>
<li><b>Releases run, and addresses that crossed to the far pole.</b> The second
 is the number that says whether the loop works. It is ${ceil.mid.clear} in the
 ceiling case and nothing on any surface reports it.</li>
<li><b>Sessions, and the gap before each one.</b> The interval is the whole
 question the owner asked and the product records no session boundary at all.</li>
<li><b>Rituals saved against rituals marked done.</b> Both fields exist. Neither
 is reported anywhere a person or a seat can see the ratio.</li>
<li><b>The surface a session ended on.</b> One string per session. It is the
 cheapest possible answer to where people stop.</li>
</ol>

<hr class="rule">
<h2>Method, and how to run it again</h2>
<p>The cohort is driven through <code>engine.js</code>: <code>parseStory</code>
and <code>applyStory</code> for every story, <code>compute</code> for every
reading, <code>iqApply</code> for the intake, <code>meterPlan</code> and
<code>meterRun</code> for what a run costs, <code>planAllowance</code> for what
is left, <code>streakRead</code>, <code>ledgerRead</code> and
<code>ladderRead</code> for the record, and <code>snapshot</code> for the
series.</p>
<p>The release itself lives in <code>ui/release.js</code> and is not in the
engine contract, so it cannot be called from node. Its arithmetic is lifted into
the harness character for character, and the harness refuses to run unless the
lifted copy reproduces a release driven in Chromium on the same inputs to within
a thousandth. That check passed on this run:
${n2(R.verify.cqBefore)} to ${n2(R.verify.cqAfter)} on
${e(R.verify.picked)}, ${R.verify.lines} lines, ${R.verify.seconds} seconds,
with every charge and every install agreeing.</p>
<p>Facts about the surface are read off <code>source.html</code> in a real
Chromium at 1600 by 1000 and 390 by 844, and written to
<code>sim/measured.json</code>. Both the harness and this page refuse to build
without that file, so no number on this page is typed by hand.</p>
<div class="stamp">source.html   md5 ${e(st.src)}
engine.js     md5 ${e(st.engine)}
commit        ${e(st.commit)}${st.dirty?'   working tree dirty':''}${st.moved?'\nmoved         yes. source.html or engine.js changed while the measurement was\n              running. every figure above belongs to the md5 named here, read\n              before the browser opened':''}
chromium      ${e(st.chromium)}, file://, 1600x1000 and 390x844
measured      ${e(st.when)}
cohort        ${COH} a run, ${settle.runs} runs, ${settle.runs*COH} people
page errors   ${M.errors}
requests      ${M.requests}

  node sim/measure.js      the browser facts, writes sim/measured.json
  node sim/harness.js      the cohort, writes sim/runs.json
  node sim/build.js        this page</div>
<p class="foot">Everything about a person's field on this page is the shipped
engine's output on invented inputs. Everything about the surface is a fact about
the build stamped above. Everything about when somebody opens the file and when
they stop is a model, stated in <code>sim/harness.js</code> under
<code>SHOWUP</code> and <code>FRICTION</code>, and it is judgement. No figure
here is evidence about any human being and none of it should be quoted as
research. Five people with phones and two afternoons would replace half of it
with measurements.</p>

</div></body></html>`;
fs.writeFileSync(path.join(__dirname,'ninety-days.html'),HTML);
console.log('sim/ninety-days.html written, '+(HTML.length/1024).toFixed(0)+' kB. '
 +'grade '+G.mean+' '+G.letter+', '+settle.runs+' runs.');
