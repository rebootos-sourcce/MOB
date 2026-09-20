/* Builds reviews/awareness.html, the page he opens to rule on the mark.
   Every path comes out of tools/awareness.js, so the page and the product
   cannot drift apart. */
const S=require('./awareness.js'), fs=require('fs'), path=require('path');
const GOLD='#D6A93B', SHADE='#A87F27';
function master(k){ S.setMaster(k);
 return {d:S.outline(34,2), vb:S.viewBox(), b:S.bbox(),
  R:S.R, EYE:S.EYE, CROSS:S.CROSS}; }
const D=master('display'), M=master('small');
function sv(m,px,fill){
 return '<svg viewBox="'+m.vb+'" width="'+(px*m.b.w/m.b.h).toFixed(1)+'" height="'+px
  +'" aria-hidden="true"><path d="'+m.d+'" fill="'+fill+'"/></svg>';}

const sizes=[[300,'Blown up',D],[120,'A header',D],[44,'Beside the wordmark',D],
             [22,'In the bar',M],[14,'Tiny, as ruled',M]]
 .map(x=>'<figure class="sz"><div class="szi">'+sv(x[2],x[0],GOLD)+'</div>'
  +'<figcaption>'+x[1]+'<em>'+x[0]+' tall, '+(x[2]===D?'display':'small')+'</em>'
  +'</figcaption></figure>').join('');

const grounds=[['#0F0F10','Dark','d',GOLD,'8.76'],['#F7F6F3','Snow','l',SHADE,'3.39'],
 ['#FFFFFF','Lumen','l',SHADE,'3.66'],['#141414','Punch','d',GOLD,'8.42']]
 .map(g=>'<figure class="gr '+g[2]+'" style="background:'+g[0]+'">'+sv(D,68,g[3])
  +'<figcaption>'+g[1]+'<em>'+g[4]+' to 1</em></figcaption></figure>').join('');

const page=`<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Awareness</title><style>
:root{--bg:#0E0E0F;--ink:#E6E7EA;--dim:#8A8C94;--line:#26282E;--gold:${GOLD};
 --card:#141518;--mono:ui-monospace,SFMono-Regular,Menlo,monospace}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);
 font:15px/1.62 ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
 -webkit-font-smoothing:antialiased}
.wrap{max-width:980px;margin:0 auto;padding:56px 24px 96px}
h1{font-size:30px;line-height:1.16;margin:0 0 6px;letter-spacing:-.012em}
/* TITLE CASE IN THE MARKUP, NOT UPPERCASE IN THE SHEET. The first version of
   this page set text-transform on the headers, which is the habit the all
   caps rule exists to stop. */
h2{font-size:13px;letter-spacing:.1em;color:var(--dim);margin:52px 0 16px;
 font-weight:600}
p{margin:0 0 14px;max-width:66ch;color:#C9CBD2}
p.lead{color:var(--dim);margin-bottom:34px}
b{color:var(--ink);font-weight:600}
.hero{display:flex;gap:40px;align-items:flex-end;flex-wrap:wrap;
 padding:40px 32px;border:1px solid var(--line);border-radius:14px;background:var(--card)}
.row{display:flex;gap:28px;flex-wrap:wrap;align-items:flex-end}
.sz{margin:0;text-align:center}
.szi{display:flex;align-items:flex-end;justify-content:center;height:310px}
figcaption{margin-top:12px;font-size:12px;color:var(--dim);letter-spacing:.04em}
figcaption em{display:block;font-style:normal;color:#5F626B;font-size:11px;margin-top:3px}
.gr{margin:0;padding:24px 28px 14px;border:1px solid var(--line);border-radius:12px;
 text-align:center}
.gr.l figcaption{color:#6C6F78}.gr.l figcaption em{color:#8A8D96}
.num{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:1px;
 background:var(--line);border:1px solid var(--line);border-radius:12px;overflow:hidden}
.num div{background:var(--card);padding:15px 17px}
.num b{display:block;font-family:var(--mono);font-size:18px;color:var(--gold);
 letter-spacing:-.01em;margin-bottom:3px}
.num span{font-size:12px;color:var(--dim)}
.q{border-left:2px solid var(--gold);padding:2px 0 2px 16px;margin:0 0 22px;color:var(--ink)}
.fix{border:1px solid var(--line);border-radius:12px;background:var(--card);
 padding:6px 22px 14px}
.fix h3{font-size:14px;margin:18px 0 6px;color:var(--ink);font-weight:600}
.fix p{margin:0 0 4px;font-size:14px}
.fix .was{color:#8A8C94;font-family:var(--mono);font-size:12px}
.ask{border:1px solid var(--line);border-radius:12px;padding:22px 24px;background:var(--card)}
.ask ol{margin:10px 0 0;padding-left:20px;color:#C9CBD2}
.ask li{margin-bottom:9px}
@media(max-width:640px){.wrap{padding:36px 16px 72px}h1{font-size:24px}.szi{height:190px}}
</style></head><body><div class="wrap">

<h1>Awareness</h1>
<p class="lead">Second pass. Drawn from the ratio, then measured against it and
against Zen, and four things were wrong that only measuring found.</p>

<p class="q">"The squiggle's a loop. Like this. Without those bars on the left
and right. It's very cute and golden ratio design. It's very tiny. And pure
gold." And then: it is called awareness.</p>

<div class="hero">${sv(D,280,GOLD)}
<div><p style="margin:0"><b>One stroke that crosses itself.</b> It rises from
the lower left, turns 342 degrees at the top, comes back down across its own
line and sweeps away to the lower right. The turn closes a small eye, and that
eye is the only enclosed space in the mark.</p>
<p style="margin:14px 0 0;color:var(--dim);font-size:13.5px">It lands at a
chord and it leaves at a point, so the mark says which way it was drawn.</p></div></div>

<h2>What The Measuring Found</h2>
<div class="fix">
<h3>It did not cross itself.</h3>
<p>The two legs passed each other without touching. Nearest approach one unit,
at a height of 29 out of 100. The ink is wide enough that they overlapped, so
the picture showed a closed eye and the geometry did not have one. A picture of
a crossing is not a crossing.</p>
<p class="was">315 degrees of turn, now 342. The first value that actually crosses.</p>

<h3>A constant named a place the drawing does not have.</h3>
<p>The crossing height was written down as 38.2, nine and a half units from
anything that happens anywhere on the mark. It is solved off the built curves
now, so it cannot drift again.</p>

<h3>The eye was a phi shaped decoration on a number that was not the eye.</h3>
<p>It was written as twice the radius, less the radius times phi divided by
phi. That multiplies and divides by the same number and cancels, so it was
exactly the radius wearing a costume, in a file whose header says every
proportion is a power of the ratio. The eye is the gap the brush leaves inside
the loop, which is what it now is.</p>

<h3>It was reversible, and that was the worst of it.</h3>
<p>Both ends were the same width to the last digit and both terminals were the
same flat chord. Hand it to somebody and ask which end the brush started at and
they could not tell, because the geometry did not say. A single stroke that
carries no direction is a shape, not a stroke. It lands at a chord now and
sweeps to nothing, which is <b>harai</b>, and the ink running out at the tail is
what proves it was one continuous pass.</p>

<h3>And the brush was told the wrong story about where it was.</h3>
<p>The weight ran across six curves by their number rather than by their
length, so the four short arcs of the turn took two thirds of the brush's whole
story and each long leg took a sixth. That is why the exit kept coming out as a
wire whatever was adjusted at that end. It runs on arc length now.</p>
</div>

<h2>At Size</h2>
<p>It has to survive being tiny, because tiny is the ruling. The smallest here
is 14 pixels tall, which is the height of a line of body text.</p>
<div class="row">${sizes}</div>

<h2>Two Masters, One Brush</h2>
<p>Opening the eye and keeping the brush are one constraint pulling two ways,
and no single set of numbers meets both. A type family answers this with
optical sizes and so does this. <b>The brush never changes.</b> The loop's
radius changes by exactly one power of phi, and nothing else moves.</p>
<div class="hero" style="gap:48px;align-items:center">
 <div style="display:flex;gap:40px;align-items:flex-end">
  <figure class="sz" style="margin:0">${sv(D,150,GOLD)}
   <figcaption>Display<em>above 24 pixels</em></figcaption></figure>
  <figure class="sz" style="margin:0">${sv(M,150,GOLD)}
   <figcaption>Small<em>at or below 24</em></figcaption></figure></div>
 <div class="num">
 <div><b>${D.R.toFixed(2)}</b><span>Display radius, height over phi to the fifth</span></div>
 <div><b>${M.R.toFixed(2)}</b><span>Small radius, one power of phi wider</span></div>
 <div><b>${S.WMAX.toFixed(2)}</b><span>The brush at its heaviest. The same in both</span></div>
 <div><b>1 / 3</b><span>Eye against outer diameter, display</span></div>
 <div><b>0.528</b><span>Eye against outer diameter, small</span></div>
 <div><b>342&deg;</b><span>How far the stroke turns</span></div>
 </div></div>

<h2>On Every Ground</h2>
<p>One mark, two inks, and the second one is not a style choice. Pure gold
reads at <b>8.76 to 1</b> on the dark ground and at <b>2.02 to 1</b> on the
light one, against a floor of 3 to 1 for a graphic. It was failing on Snow and
on Lumen. The shade was already in the file and it passes everywhere.</p>
<div class="row">${grounds}</div>
<div class="num" style="margin-top:18px">
<div><b>${GOLD}</b><span>The gold. Dark grounds</span></div>
<div><b>${SHADE}</b><span>The shade. Light grounds, 3.39 and 3.66 to 1</span></div>
</div>

<h2>What Is Still Not Right</h2>
<p>Said plainly rather than left for you to find. The two joins where the legs
meet the turn are smooth in direction but not in curvature, and the one solid
finding in the whole golden ratio literature is that about four people in five
prefer a curve that is continuous in curvature. That is a rewrite of how the
legs meet the circle, not a constant. And the centreline is still six curves
dimensioned by the ratio rather than one drawn stroke, which is the ceiling on
how alive it can look.</p>

<h2>What I Need From You</h2>
<div class="ask"><ol>
<li><b>The drawing.</b> Is this the loop.</li>
<li><b>Open or closed.</b> An enso drawn with a gap means becoming, and one
closed means complete. This one is closed. For a mark called awareness that may
be the wrong way round.</li>
<li><b>Where it goes first.</b> It is the crown of the mark stack, and the
stack is waiting on it.</li>
</ol></div>

</div></body></html>`;
const out=path.resolve(__dirname,'..','reviews','awareness.html');
fs.writeFileSync(out,page);
console.log('wrote '+out+'  '+page.length+' bytes');
