/* ============================================================
   THE SHARED SHELL FOR THE SIMULATION PAGES.

   sim/ninety-days.html carried its own copy of this and a second page copying it
   again would be two places to fix one thing. The style, the escape, the number
   formats and the charts live here. Nothing in this file reads a measurement or
   holds a figure.
   ============================================================ */
const CSS=`
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
.note.bad{border-color:var(--bad)}
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
.ch{width:100%;height:auto;display:block;overflow:visible}
/* A CHART IS NOT A PICTURE, IT IS TYPE. Scaling an 880 wide frame into 358
   scales its 12px labels to about 5 and the most important chart on the page
   stops being readable exactly where it is read most. The frame keeps a minimum
   width on a phone and scrolls inside its own box, which is what the tables
   already do. */
.chwrap{overflow-x:auto;margin:10px 0 6px;-webkit-overflow-scrolling:touch}
.gl{stroke:var(--line);stroke-width:1}
.ln{fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}
.dot{fill:var(--dim)}
text{font:400 12px ui-sans-serif,system-ui,sans-serif}
.ax{fill:var(--dim)}
.bl{fill:var(--mid);font-size:12.5px}
.bn{fill:var(--ink);font-size:12.5px}
.lg{font-size:12.5px;font-weight:600}
table.tb{width:100%;border-collapse:collapse;margin:14px 0 6px;font-size:14px}
table.tb th{text-align:left;font-weight:600;font-size:11.5px;letter-spacing:.09em;
 text-transform:uppercase;color:var(--dim);border-bottom:1px solid var(--line);
 padding:0 12px 8px 0;vertical-align:bottom}
table.tb td{padding:11px 12px 11px 0;border-bottom:1px solid var(--line);vertical-align:top}
table.tb td.num{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}
table.tb tr.tot td{border-bottom:0;border-top:1px solid var(--line)}
table.tb tr.zero td{background:rgba(212,115,109,.07)}
table.tb tr.win td{background:rgba(104,203,164,.06)}
table.tb tr.soft td{background:rgba(218,191,106,.06)}
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
blockquote{margin:0 0 12px;padding:0 0 0 14px;border-left:2px solid var(--accent);
 color:var(--ink);font-size:15px;line-height:1.55}
blockquote p{margin:0 0 7px;max-width:52ch}
blockquote p:last-child{margin:0}
.tag{display:inline-block;font:600 11px/1 ui-monospace,SFMono-Regular,Menlo,monospace;
 letter-spacing:.06em;color:var(--au);border:1px solid var(--line);border-radius:4px;
 padding:4px 6px;background:var(--sunk);white-space:nowrap}
.tag.g{color:var(--good)} .tag.b{color:var(--bad)} .tag.m{color:var(--mid)}
ul,ol{margin:0 0 16px;padding-left:22px;max-width:74ch}
li{margin-bottom:8px}
li b{font-weight:600}
code{font:400 13.5px ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
 background:var(--sunk);border:1px solid var(--line);border-radius:4px;padding:1px 5px}
.foot{color:var(--dim);font-size:13px;margin-top:40px}
@media (max-width:820px){
 .ch{min-width:700px}
 .g3,.g2,.g4{grid-template-columns:1fr}
 .wrap{padding:26px 16px 70px}
 table.tb{display:block;overflow-x:auto;white-space:nowrap}
 td.q{white-space:normal;min-width:30ch}
 .fine{white-space:normal}
}
@media print{body{background:#fff;color:#111}}
`;
const e=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const pc=(v,d)=>(v*100).toFixed(d===undefined?1:d)+'%';
const n1=v=>(+v).toFixed(1), n2=v=>(+v).toFixed(2);
const sg=v=>(v>=0?'+':'')+(+v).toFixed(2);
const WORDS=['no','one','two','three','four','five','six','seven','eight','nine',
 'ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen',
 'eighteen','nineteen','twenty'];
const word=n=>{
 if(n<WORDS.length)return WORDS[n];
 const tens=['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
 if(n<100)return (tens[Math.floor(n/10)]+(n%10?' '+WORDS[n%10]:'')).trim();
 return String(n);};
const Word=n=>{const w=word(n); return w.charAt(0).toUpperCase()+w.slice(1);};


/* ============================================================
   THE BUILD BLOCK. Every page here states the build it was measured against,
   whether that build was pinned, and whether the working tree moved under the
   run. A page that prints a grade and not the build it graded is asking to be
   read against whatever is on disk the day somebody opens it.
   ============================================================ */
function buildBlock(st,drift,fst){
 const moved=drift&&(drift.worktreeSrc!==st.src||drift.worktreeEngine!==st.engine);
 let t='source.html   md5 '+e(st.src)+'\n'
  +'engine.js     md5 '+e(st.engine)+'\n'
  +'commit        '+e(st.commit)+(st.dirty?'   working tree dirty':'')+'\n';
 if(fst)t+='fold probe    md5 '+e(fst.src)+'   commit '+e(fst.commit)
  +(fst.moved?'   THE BUILD MOVED DURING THE PROBE':'')+'\n';
 if(drift&&drift.pin)t+='pinned at     '+e(drift.pin)+'\n';
 if(drift)t+='working tree  source.html '+e(drift.worktreeSrc)
  +'\n              engine.js   '+e(drift.worktreeEngine)+'\n';
 if(moved)t+='\nTHE BUILD MOVED UNDER THIS RUN. Two seats were live in atuned_src and\n'
  +'the release path while it ran. Everything measured here was measured\n'
  +'against the pinned build above and nothing was measured against the\n'
  +'working tree. Re-measure before reading these numbers against a newer\n'
  +'build.\n';
 return t;}

function head(title,lede){
 return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${e(title)}</title><meta name="description" content="${e(lede)}">
<style>${CSS}</style></head><body><div class="wrap">`;}

/* a stepped line, one series, with a target rule and point labels */
function stepChart(pts,opt){
 opt=opt||{};
 const W=880,Hh=340,L=42,Rr=120,T=18,B=64;
 const hi=opt.hi===undefined?100:opt.hi, lo=opt.lo===undefined?30:opt.lo;
 const y=v=>T+(hi-Math.max(lo,Math.min(hi,v)))/(hi-lo)*(Hh-T-B);
 const x=i=>L+(pts.length<2?0:i/(pts.length-1))*(W-L-Rr);
 let g='';
 (opt.ticks||[40,50,60,70,80,90,100]).forEach(v=>{
  if(v>hi||v<lo)return;
  g+=`<line class="gl" x1="${L}" y1="${y(v).toFixed(1)}" x2="${W-Rr}" y2="${y(v).toFixed(1)}"/>`
   +`<text class="ax" x="${L-8}" y="${(y(v)+4).toFixed(1)}" text-anchor="end">${v}</text>`;});
 (opt.rules||[]).forEach(r=>{
  g+=`<line x1="${L}" y1="${y(r.v).toFixed(1)}" x2="${W-Rr+94}" y2="${y(r.v).toFixed(1)}" `
   +`stroke="${r.col}" stroke-width="1.5" stroke-dasharray="5 4" opacity=".9"/>`
   +`<text class="lg" x="${W-Rr+98}" y="${(y(r.v)+4).toFixed(1)}" fill="${r.col}">${e(r.nm)}</text>`;});
 let d='';
 pts.forEach((p,i)=>{d+=(i?' L':'M')+x(i).toFixed(1)+' '+y(p.v).toFixed(1);});
 g+=`<path class="ln" d="${d}" stroke="${opt.col||'#7EB8D4'}" stroke-width="2.4"/>`;
 pts.forEach((p,i)=>{
  g+=`<circle cx="${x(i).toFixed(1)}" cy="${y(p.v).toFixed(1)}" r="4" fill="${opt.col||'#7EB8D4'}"/>`;
  g+=`<text class="bn" x="${x(i).toFixed(1)}" y="${(y(p.v)-11).toFixed(1)}" text-anchor="middle">${n1(p.v)}</text>`;
  g+=`<text class="ax" x="${x(i).toFixed(1)}" y="${Hh-B+20}" text-anchor="middle">${e(p.k)}</text>`;
  if(p.k2)g+=`<text class="ax" x="${x(i).toFixed(1)}" y="${Hh-B+34}" text-anchor="middle" opacity=".7">${e(p.k2)}</text>`;});
 return `<div class="chwrap"><svg class="ch" viewBox="0 0 ${W} ${Hh}" role="img" aria-label="${e(opt.alt||'')}">${g}</svg></div>`;}

/* horizontal bars, signed, for a solo ranking */
function barsSigned(rows,opt){
 opt=opt||{};
 const W=880, rowH=26, Rr=60, T=16;
 /* THE LABEL GUTTER IS SIZED FROM THE LONGEST LABEL. A fixed 210 with the text
    right anchored against it pushed "C10 A price, and an allowance with
    something behind it" off the left edge of the frame, where a phone shows it
    first. Labels are left anchored now and the gutter is measured. */
 const lab=Math.max.apply(null,rows.map(r=>String(r.k).length));
 const L=Math.min(430,Math.max(150,lab*6.35+14));
 const Hh=T+rows.length*rowH+18;
 const mx=Math.max(0.5,Math.max.apply(null,rows.map(r=>Math.abs(r.v))));
 const zero=L+(W-L-Rr)*0.13;
 const sc=v=>v/mx*(W-L-Rr-(zero-L));
 let g=`<line class="gl" x1="${zero}" y1="${T-6}" x2="${zero}" y2="${Hh-14}"/>`;
 rows.forEach((r,i)=>{
  const yy=T+i*rowH, w=sc(r.v);
  const col=r.soft?'#DABF6A':(r.v>0?'#68CBA4':(r.v<0?'#D4736D':'#94908A'));
  g+=`<text class="bl" x="4" y="${yy+13}">${e(r.k)}</text>`;
  g+=`<rect x="${(w<0?zero+w:zero).toFixed(1)}" y="${yy+3}" width="${Math.max(1.5,Math.abs(w)).toFixed(1)}" height="15" fill="${col}" opacity=".9" rx="2"/>`;
  g+=`<text class="bn" x="${(w<0?zero+w-6:zero+Math.abs(w)+6).toFixed(1)}" y="${yy+15}" text-anchor="${w<0?'end':'start'}">${sg(r.v)}</text>`;});
 return `<div class="chwrap"><svg class="ch" viewBox="0 0 ${W} ${Hh}" role="img" aria-label="${e(opt.alt||'')}">${g}</svg></div>`;}

/* several ninety day lines on one frame, for the ceiling cases */
function multiLine(series,opt){
 opt=opt||{};
 const W=880,Hh=300,L=42,T=16,B=34;
 /* THE RIGHT GUTTER IS SIZED FROM THE LONGEST LABEL, not chosen. A fixed 150
    clipped "C2b install to the pole" off the edge of the frame, which is a
    legend that hides the series it names. */
 const Rr=Math.min(320,Math.max(120,
  8+Math.max.apply(null,series.map(s=>String(s.nm).length))*7.1));
 const all=[].concat.apply([],series.map(s=>s.v));
 const hi=opt.hi===undefined?Math.ceil(Math.max.apply(null,all)/5)*5+2:opt.hi;
 const lo=opt.lo===undefined?Math.floor(Math.min.apply(null,all)/5)*5-2:opt.lo;
 const y=v=>T+(hi-v)/(hi-lo)*(Hh-T-B);
 const x=i=>L+i/(series[0].v.length-1)*(W-L-Rr);
 let g='';
 /* AND THE GRID STEP COMES OFF THE RANGE. A fixed step of ten drew two lines
    across a span of eight and the reader could not tell a flat line from a
    moving one, which is the whole question this chart is asked. */
 const span=hi-lo;
 const step=span<=6?1:(span<=15?2:(span<=40?5:10));
 for(let v=Math.ceil(lo/step)*step;v<=hi;v+=step)
  g+=`<line class="gl" x1="${L}" y1="${y(v).toFixed(1)}" x2="${W-Rr}" y2="${y(v).toFixed(1)}"/>`
   +`<text class="ax" x="${L-8}" y="${(y(v)+4).toFixed(1)}" text-anchor="end">${v}</text>`;
 [1,30,60,90].forEach(d=>{
  g+=`<text class="ax" x="${x(d-1).toFixed(1)}" y="${Hh-B+20}" text-anchor="middle">day ${d}</text>`;});
 series.forEach((s,si)=>{
  let d='';
  s.v.forEach((v,i)=>{d+=(i?' L':'M')+x(i).toFixed(1)+' '+y(v).toFixed(1);});
  g+=`<path class="ln" d="${d}" stroke="${s.col}" stroke-width="${s.w||2}"/>`;
  const yy=y(s.v[s.v.length-1]);
  g+=`<text class="lg" x="${W-Rr+8}" y="${(T+14+si*17).toFixed(1)}" fill="${s.col}">${e(s.nm)}</text>`
   +`<line x1="${(W-Rr).toFixed(1)}" y1="${yy.toFixed(1)}" x2="${(W-Rr+4).toFixed(1)}" y2="${(T+10+si*17).toFixed(1)}" stroke="${s.col}" stroke-width="1" opacity=".5"/>`;});
 return `<div class="chwrap"><svg class="ch" viewBox="0 0 ${W} ${Hh}" role="img" aria-label="${e(opt.alt||'')}">${g}</svg></div>`;}

module.exports={CSS,e,pc,n1,n2,sg,word,Word,head,buildBlock,stepChart,barsSigned,multiLine};
