#!/usr/bin/env node
/* ============================================================
   THE STORYBOARD, ASSEMBLED. Reads frames.js (the order and the captions),
   shots/*.png and shots/frames.json (what capture.js photographed and read
   off the page) and writes index.html: one file, no dependencies, every
   picture inside it.

     NODE_PATH=/opt/node22/lib/node_modules node mockups/paywall-storyboard/build.js

   The pictures go in as WebP, encoded by Chromium itself (canvas toDataURL),
   because a PNG of a dark screen is several times larger and the file has to
   travel as one attachment. The PNGs in shots/ stay the originals.
   ============================================================ */
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const { FRAMES, STATES } = require('./frames.js');
const DIR = __dirname, SHOTS = path.join(DIR, 'shots');
const SAID = JSON.parse(fs.readFileSync(path.join(SHOTS, 'frames.json'), 'utf8'));
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* what a frame said, as one or two lines of quoted text */
function quote(f, W) {
  const s = (SAID[f.id] || {})[W] || {};
  const v = s[f.said];
  if (v == null || v === '') return '';
  if (f.said === 'status') return v[0] ? v[0] : '';
  if (f.said === 'numbers') return 'Read off the panel: ' + v.addresses + ' addresses picked, ' + v.planned
    + ' new patterns this run would spend, ' + v.left + ' left in the gift.';
  if (f.said === 'requests') return '';
  return Array.isArray(v) ? v.join(' ') : String(v);
}

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const pg = await browser.newPage();
  const webp = async file => {
    const b64 = fs.readFileSync(file).toString('base64');
    return pg.evaluate(async src => {
      const im = new Image(); im.src = src; await im.decode();
      const c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight;
      c.getContext('2d').drawImage(im, 0, 0);
      return { url: c.toDataURL('image/webp', 0.86), w: im.naturalWidth, h: im.naturalHeight };
    }, 'data:image/png;base64,' + b64);
  };
  const out = [];
  for (const f of FRAMES) {
    const o = Object.assign({}, f, { img: {}, saidText: {} });
    if (!f.card) for (const W of [1600, 390]) {
      const name = (f.shots && f.shots[W]) || (f.id + '-' + W);
      const file = path.join(SHOTS, name + '.png');
      if (!fs.existsSync(file)) { console.log('  missing ' + name); continue; }
      o.img[W] = await webp(file);
      o.saidText[W] = quote(f, W);
    }
    out.push(o);
    console.log('  ' + f.n + ' ' + f.id);
  }
  await browser.close();
  const html = page(out);
  fs.writeFileSync(path.join(DIR, 'index.html'), html);
  console.log('index.html ' + html.length.toLocaleString() + ' bytes, ' + out.length + ' frames');
})().catch(e => { console.log(e.stack); process.exit(1); });

function page(frames) {
  const data = frames.map(f => ({ id: f.id, seq: f.seq, n: f.n, title: f.title, state: f.state, card: !!f.card, tall: !!f.tall,
    see: f.see, on: f.on, ruled: f.ruled, note: f.note || '', presses: f.presses || '', said: f.said || '', saidText: f.saidText,
    img: f.img }));
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Paywall storyboard</title>
<style>
:root{--bg:#f4f3ef;--panel:#ffffff;--ink:#1d1f22;--mid:#4b4f55;--dim:#73777e;--edge:#d9d7d0;
 --live:#2f6b4f;--closed:#8a5a12;--nb:#7a2f2f;--draft:#4a4f8a;--ours:#555;--acc:#2d5f86;--sunk:#e9e7e1}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#121316;--panel:#1b1d21;--ink:#e8e8ea;--mid:#b4b7bd;--dim:#8d9097;
 --edge:#2e3137;--live:#7cc4a0;--closed:#e0b264;--nb:#e08f8f;--draft:#a9adf0;--ours:#aaa;--acc:#8cc0e8;--sunk:#0d0e10}}
:root[data-theme="dark"]{--bg:#121316;--panel:#1b1d21;--ink:#e8e8ea;--mid:#b4b7bd;--dim:#8d9097;
 --edge:#2e3137;--live:#7cc4a0;--closed:#e0b264;--nb:#e08f8f;--draft:#a9adf0;--ours:#aaa;--acc:#8cc0e8;--sunk:#0d0e10}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.55 system-ui,-apple-system,"Segoe UI",sans-serif}
header{padding:16px 16px 8px;max-width:1500px;margin:0 auto}
h1{font-size:20px;margin:0 0 4px;font-weight:600}
.sub{color:var(--mid);margin:0;font-size:14px;max-width:90ch}
.bar{position:sticky;top:0;z-index:5;background:var(--bg);border-bottom:1px solid var(--edge)}
.bar-in{max-width:1500px;margin:0 auto;padding:8px 16px;display:flex;flex-wrap:wrap;gap:8px;align-items:center}
button{font:inherit;color:var(--ink);background:var(--panel);border:1px solid var(--edge);border-radius:8px;padding:7px 12px;min-height:40px;cursor:pointer}
button[aria-pressed="true"]{border-color:var(--acc);box-shadow:inset 0 0 0 1px var(--acc)}
button:disabled{opacity:.4;cursor:default}
.pos{color:var(--mid);font-variant-numeric:tabular-nums;min-width:7ch;text-align:center}
.grow{flex:1}
select{font:inherit;color:var(--ink);background:var(--panel);border:1px solid var(--edge);border-radius:8px;padding:7px 8px;min-height:40px;max-width:100%}
main{max-width:1500px;margin:0 auto;padding:14px 16px 40px;display:grid;grid-template-columns:minmax(0,1fr) 360px;gap:20px;align-items:start}
.cap{background:var(--panel);border:1px solid var(--edge);border-radius:10px;padding:14px 16px;position:sticky;top:70px}
.cap h2{font-size:18px;margin:2px 0 8px;line-height:1.3}
.n{font-size:12px;letter-spacing:.06em;color:var(--dim);font-weight:600}
.st{display:inline-block;font-size:12px;font-weight:700;letter-spacing:.06em;border:1.5px solid currentColor;border-radius:4px;padding:1px 6px;margin:0 6px 0 0}
.st.LIVE{color:var(--live)}.st.CLOSED{color:var(--closed)}.st.NOT-BUILT{color:var(--nb)}.st.DRAFT{color:var(--draft)}.st.NOT-OURS{color:var(--ours)}
.stm{color:var(--mid);font-size:13px}
.cap dl{margin:12px 0 0}.cap dt{font-size:12px;font-weight:600;color:var(--dim);letter-spacing:.04em;margin-top:10px}
.cap dd{margin:2px 0 0;font-size:14px}
.q{margin:10px 0 0;padding:8px 10px;border-left:3px solid var(--acc);background:var(--sunk);font-size:14px;white-space:pre-wrap}
.stage{background:var(--sunk);border:1px solid var(--edge);border-radius:10px;padding:10px;min-height:200px;display:flex;justify-content:center}
.stage img{display:block;max-width:100%;height:auto;border-radius:6px;box-shadow:0 2px 12px rgba(0,0,0,.25)}
.stage.w390 img{max-width:min(100%,390px)}
.stage.tall{max-height:78vh;overflow:auto;align-items:flex-start}
.stage.tall img{max-height:none}
.card{max-width:640px;padding:28px;font-size:16px;align-self:center}
.card p{margin:0 0 12px}
.hint{color:var(--dim);font-size:13px;margin:6px 0 0}
@media (max-width:980px){main{grid-template-columns:1fr}.cap{position:static}}
</style></head><body>
<header><h1>Paywall and cancellation, as built</h1>
<p class="sub">Every frame is the current build (main, commit 387c94d0, the one atuned.world published on 16 October), photographed in a real browser. A is what a person meets before paying. B is how they stop. Arrow keys step. D and P switch desktop and phone. Each frame says LIVE, CLOSED, NOT BUILT, DRAFT or NOT OURS, and what that means.</p></header>
<div class="bar"><div class="bar-in">
<button id="prev" type="button" aria-label="Previous frame">&larr; Back</button>
<span class="pos" id="pos"></span>
<button id="next" type="button" aria-label="Next frame">Next &rarr;</button>
<select id="jump" aria-label="Go to a frame"></select>
<span class="grow"></span>
<button id="vd" type="button" aria-pressed="true">Desktop 1600</button>
<button id="vp" type="button" aria-pressed="false">Phone 390</button>
</div></div>
<main><div><div class="stage" id="stage"></div><p class="hint" id="hint"></p></div><aside class="cap" id="cap"></aside></main>
<script>
var F=${JSON.stringify(data)};
var ST=${JSON.stringify(STATES)};
var i=0, W=1600;
try{var h=location.hash.slice(1); var k=F.findIndex(function(f){return f.id===h;}); if(k>=0)i=k;}catch(e){}
try{if(window.innerWidth<700)W=390;}catch(e){}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
var jump=document.getElementById('jump');
jump.innerHTML=F.map(function(f,k){return '<option value="'+k+'">'+esc(f.n+'. '+f.title)+'</option>';}).join('');
function draw(){
 var f=F[i], st=document.getElementById('stage');
 st.className='stage'+(W===390?' w390':'')+(f.tall?' tall':'');
 if(f.card)st.innerHTML='<div class="card"><p><b>No picture for this frame.</b></p><p>'+esc(ST[f.state])+'</p><p>'+esc(f.see)+'</p></div>';
 else{var im=f.img[W]; st.innerHTML=im?'<img alt="'+esc(f.n+', '+f.title+', at '+W+' wide')+'" src="'+im.url+'" width="'+im.w+'" height="'+im.h+'">':'<div class="card">This width was not captured.</div>';
  st.scrollTop=0;}
 document.getElementById('hint').textContent=f.card?'':(f.tall?'A long page: scroll inside the picture. ':'')+(W===1600?'Desktop, 1600 by 1000.':'Phone, 390 by 844.');
 var q=(f.said&&f.saidText)?f.saidText[W]:'';
 document.getElementById('cap').innerHTML='<div class="n">'+esc(f.n)+' &middot; '+(f.seq==='A'?'The paywall':'The cancellation')+'</div>'
  +'<h2>'+esc(f.title)+'</h2>'
  +'<div><span class="st '+f.state.replace(' ','-')+'">'+esc(f.state)+'</span><span class="stm">'+esc(ST[f.state])+'</span></div>'
  +'<dl><dt>What the person sees</dt><dd>'+esc(f.see)+'</dd>'
  +(f.presses?'<dt>Presses</dt><dd>'+esc(f.presses)+'</dd>':'')
  +'<dt>Built on</dt><dd>'+esc(f.on)+'</dd>'
  +'<dt>Ruled or draft</dt><dd>'+esc(f.ruled)+'</dd>'
  +(f.note?'<dt>About this picture</dt><dd>'+esc(f.note)+'</dd>':'')+'</dl>'
  +(q?'<div class="q">Read off the screen: '+esc(q)+'</div>':'');
 document.getElementById('pos').textContent=(i+1)+' of '+F.length;
 document.getElementById('prev').disabled=i===0; document.getElementById('next').disabled=i===F.length-1;
 jump.value=String(i);
 document.getElementById('vd').setAttribute('aria-pressed',String(W===1600));
 document.getElementById('vp').setAttribute('aria-pressed',String(W===390));
 try{history.replaceState(null,'','#'+f.id);}catch(e){}}
function go(d){i=Math.max(0,Math.min(F.length-1,i+d)); draw();}
document.getElementById('prev').onclick=function(){go(-1);};
document.getElementById('next').onclick=function(){go(1);};
jump.onchange=function(){i=+jump.value; draw();};
document.getElementById('vd').onclick=function(){W=1600; draw();};
document.getElementById('vp').onclick=function(){W=390; draw();};
document.addEventListener('keydown',function(e){
 if(e.target&&e.target.tagName==='SELECT')return;
 if(e.key==='ArrowRight'){go(1); e.preventDefault();}
 else if(e.key==='ArrowLeft'){go(-1); e.preventDefault();}
 else if(e.key==='d'||e.key==='D'){W=1600; draw();}
 else if(e.key==='p'||e.key==='P'){W=390; draw();}});
draw();
</script></body></html>`;
}
