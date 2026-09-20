/* Builds reviews/soul-loop.html, the page he opens to rule on the drawing.
   Every path on it comes out of tools/soulloop.js, so the page and the
   product cannot drift apart. */
const S=require('./soulloop.js'), fs=require('fs'), path=require('path');
const D=S.outline(30,2), DLO=S.outline(12,1);
const VB='0 0 '+S.W.toFixed(2)+' 100';
const GOLD='#D6A93B', GOLD_HI='#F0C85A', GOLD_LO='#A87F27';
const sv=(px,fill,extra)=>'<svg viewBox="'+VB+'" width="'+(px*S.W/100).toFixed(1)
 +'" height="'+px+'" aria-hidden="true">'+(extra||'')+'<path d="'+D+'" fill="'+fill+'"/></svg>';

/* the construction, with the phi derivation shown */
const cx=S.W/S.PHI, cy=S.R*S.PHI*S.PHI;
const guide='<g stroke="#5A6472" stroke-width=".6" fill="none" stroke-dasharray="2 2">'
 +'<rect x="0" y="0" width="'+S.W.toFixed(2)+'" height="100"/>'
 +'<circle cx="'+cx.toFixed(2)+'" cy="'+cy.toFixed(2)+'" r="'+S.R.toFixed(2)+'"/>'
 +'<line x1="0" y1="'+S.CROSS.toFixed(2)+'" x2="'+S.W.toFixed(2)+'" y2="'+S.CROSS.toFixed(2)+'"/>'
 +'<line x1="'+cx.toFixed(2)+'" y1="0" x2="'+cx.toFixed(2)+'" y2="100"/></g>';

const SIZES=[[320,'Blown up'],[120,'A header'],[44,'Beside the wordmark'],
             [22,'In the bar'],[14,'Tiny, as ruled']];

let sizes=SIZES.map(s=>'<figure class="sz"><div class="szi">'+sv(s[0],GOLD)+'</div>'
 +'<figcaption>'+s[1]+'<em>'+s[0]+' tall</em></figcaption></figure>').join('');

let grounds=[['#0F0F10','Dark','d'],['#F7F6F3','Snow','l'],['#FFFFFF','Lumen','l'],
 ['#141414','Punch','d']].map(g=>'<figure class="gr '+g[2]+'" style="background:'+g[0]+'">'
 +sv(72,GOLD)+'<figcaption>'+g[1]+'</figcaption></figure>').join('');

const page=`<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>The Soul Loop</title><style>
:root{--bg:#0E0E0F;--ink:#E6E7EA;--dim:#8A8C94;--line:#26282E;--gold:${GOLD};
 --card:#141518;--mono:ui-monospace,SFMono-Regular,Menlo,monospace}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);
 font:15px/1.62 ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
 -webkit-font-smoothing:antialiased}
.wrap{max-width:980px;margin:0 auto;padding:56px 24px 96px}
h1{font-size:30px;line-height:1.16;margin:0 0 6px;letter-spacing:-.012em}
h2{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--dim);
 margin:52px 0 16px;font-weight:600}
p{margin:0 0 14px;max-width:66ch;color:#C9CBD2}
p.lead{color:var(--dim);margin-bottom:34px}
b{color:var(--ink);font-weight:600}
.hero{display:flex;gap:40px;align-items:flex-end;flex-wrap:wrap;
 padding:40px 32px;border:1px solid var(--line);border-radius:14px;background:var(--card)}
.row{display:flex;gap:28px;flex-wrap:wrap;align-items:flex-end}
.sz{margin:0;text-align:center}
.szi{display:flex;align-items:flex-end;justify-content:center;height:330px}
figcaption{margin-top:12px;font-size:12px;color:var(--dim);letter-spacing:.04em}
figcaption em{display:block;font-style:normal;color:#5F626B;font-size:11px;margin-top:3px}
.gr{margin:0;padding:26px 30px 16px;border:1px solid var(--line);border-radius:12px;
 text-align:center}
.gr.l figcaption{color:#6C6F78}
.num{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:1px;
 background:var(--line);border:1px solid var(--line);border-radius:12px;overflow:hidden}
.num div{background:var(--card);padding:16px 18px}
.num b{display:block;font-family:var(--mono);font-size:19px;color:var(--gold);
 letter-spacing:-.01em;margin-bottom:3px}
.num span{font-size:12px;color:var(--dim)}
pre{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:16px;
 overflow:auto;font-family:var(--mono);font-size:11.5px;color:#9BA0AA;line-height:1.5}
.q{border-left:2px solid var(--gold);padding:2px 0 2px 16px;margin:0 0 22px;color:var(--ink)}
.ask{border:1px solid var(--line);border-radius:12px;padding:22px 24px;background:var(--card)}
.ask ol{margin:10px 0 0;padding-left:20px;color:#C9CBD2}
.ask li{margin-bottom:9px}
@media(max-width:640px){.wrap{padding:36px 16px 72px}h1{font-size:24px}.szi{height:200px}}
</style></head><body><div class="wrap">

<h1>The Soul Loop</h1>
<p class="lead">Ruled 20 September. Drawn from the ratio, not by eye.</p>

<p class="q">"The squiggle's a loop. Like this. Without those bars on the left
and right. It's very cute and golden ratio design. It's very tiny. And pure gold."</p>

<div class="hero">${sv(300,GOLD)}
<div><p style="margin:0"><b>One stroke that crosses itself.</b> It rises from the
lower left, curls over at the top, comes back down across its own line and runs
away to the lower right. The curl closes a small almond, tilted the way yours is,
and that almond is the only enclosed space in the mark.</p>
<p style="margin:14px 0 0;color:var(--dim);font-size:13.5px">No bars. They belong
to the character around it in your photograph, not to this.</p></div></div>

<h2>At Size</h2>
<p>It has to survive being tiny, because tiny is the ruling. The smallest here is
14 pixels tall, which is the height of a line of body text.</p>
<div class="row">${sizes}</div>

<h2>On Every Ground</h2>
<p>One gold, four lightings. It is a solid fill and never an outline, so nothing
about it changes between them.</p>
<div class="row">${grounds}</div>

<h2>The Construction</h2>
<p>Every proportion is a power of the golden ratio. The dotted guides are the
frame, the circle the curl is built on, the axis it stands on, and the line the
crossing falls on.</p>
<div class="hero" style="gap:56px">
${sv(300,'rgba(214,169,59,.30)',guide)}
<div class="num">
<div><b>1.618034</b><span>The ratio, φ</span></div>
<div><b>100 by 61.8</b><span>Height, and height divided by φ</span></div>
<div><b>9.02</b><span>The curl's radius, height over φ to the fifth</span></div>
<div><b>38.2</b><span>Where it crosses itself, from the top. Height over φ squared</span></div>
<div><b>8.1</b><span>The brush at its heaviest, 0.90 of the radius</span></div>
<div><b>315°</b><span>How far the stroke turns through the curl</span></div>
</div></div>

<h2>The Gold</h2>
<p>Pure, as ruled, and one value rather than a gradient. A gradient is a lighting
effect and this mark has to hold at 14 pixels on paper as well as on a screen.</p>
<div class="num">
<div><b>${GOLD}</b><span>The gold. The mark is this and nothing else</span></div>
<div><b>${GOLD_HI}</b><span>Lift, if a moving version needs a highlight</span></div>
<div><b>${GOLD_LO}</b><span>Shade, for the same reason</span></div>
</div>

<h2>Why It Is Not A Stroked Line</h2>
<p>A brush is not a pen. The weight changes along the stroke: it lands light,
presses through the curl and lifts at the tip. A line of constant width cannot do
that, so the drawing is a filled outline. The centre line is sampled, a weight is
read off at each sample, and the two edges are emitted as one closed shape. That
is why it thickens and thins at any size without a single blur or filter.</p>
<pre>tools/soulloop.js     the geometry, and the only place the numbers live
tools/soulpage.js     builds this page from it
one path, ${D.length} characters at full fidelity, ${DLO.length} at the size it ships</pre>

<h2>What I Need From You</h2>
<div class="ask"><ol>
<li><b>The drawing.</b> Is this the loop, or is the curl still wrong somewhere.</li>
<li><b>The weight.</b> The eye opens as the brush gets lighter. This is 0.90 of the
radius and it can go either way.</li>
<li><b>Where it goes first.</b> It is the crown of the mark stack, and the stack is
waiting on it.</li>
</ol></div>

</div></body></html>`;
const out=path.resolve(__dirname,'..','reviews','soul-loop.html');
fs.writeFileSync(out,page);
console.log('wrote '+out+'  '+page.length+' bytes');
