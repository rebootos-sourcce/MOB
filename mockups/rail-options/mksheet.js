/* Writes index.html, the contact sheet, from shots/measure.json so the numbers on it are read off the run and not typed.
   Run from the repo root:  node mockups/rail-options/mksheet.js */
const fs=require('fs'), path=require('path');
const DIR=__dirname, M=JSON.parse(fs.readFileSync(path.join(DIR,'shots/measure.json')));
const BASE={choices:14,archTop:941,archBottom:985,panel:990};
const names={A:'The spine',B:'The orrery',C:'The common axis',D:'The figure'};
const opts={
A:{one:'The wire that runs down the gutter today becomes a column of the 112 addresses, seven seat clusters, crown at the top. Rows stay rows, with a form where the bar was.',
 glance:[
  ['CQ and DQ, one bar','Left end, a ring of 21 arcs, thick where a law is held and a hairline where it is open. Right end, an eclipse: the dark disc covers exactly the share DQ says. Seven coloured marks run the whole width of the bar, one a seat, as tall as the charge there. The white line is how far the person swings.'],
  ['Vitality','A yellow vessel, filled to the energy left.'],['Awareness','An indigo iris, open as wide as it sees.'],['Will','A blue arrow, as long as the will that gets through, swaying with what does not.'],['Radiance','A sun with a ray in each of the three element colours. A bigger halo is more light.'],
  ['The 112 addresses','A column of seven lamps, crown at the top. One dot is one address. Bright and small is clear. A black core and dark, larger dots is heavy. The words darkest and lightest sit on those two seats.'],
  ['Flow','The band under the rows, in a lane as tall as CQ. Level and roughness are SQ at each seat. Faster water is more DQ.']],
 squint:'Blur it and you get a coloured bar, a column of seven lamps and four symbols in a list. The bar and the heaviest lamp are what jump out. For a clear person the lamps all look alike, which is correct. Nobody has to learn a new structure: it is still a list with a spine beside it.',
 cost:['Lowest build cost. Rows stay rows, so the six-row assumption in ui/railwire.js (the gutter wire and its pulses) is the one piece that is retired and replaced by the spine.','New work: the CQ and DQ bar, four small renderers (vessel, iris, arrow, sun), one SVG of 112 dots with seven gradients. Redraw is one band path write a frame plus CSS breathing, about 80 to 125 running CSS animations.','Touches ui/ui.js (the key and keylo block), ui/component.js (rbRow and rbWave), ui/railwire.js, ui/railtiles.js.','Weakest on symbolism: it is still a list. Strongest on being buildable next.']},
B:{one:'The readings stop being rows and become one instrument, a ring of rings, in the Field\'s own orientation: Root at the top, clockwise to Crown.',
 glance:[
  ['CQ','The outer ring of 21 arcs, seated by seat, thick where a law is held. Printed on the one bar beneath.'],
  ['DQ','The seven rosettes are the seats, each made of its own addresses. The same figure is on the bar, with the seven marks across it.'],
  ['Vitality, awareness, will','Three forms on the three arms of a trefoil: a yellow vessel, an indigo iris, a blue arrow. The arm inside each is as long as its figure.'],
  ['Radiance','The glow where the three arms meet, and the area the three enclose.'],
  ['The 112 addresses','Dark and dense rosette is heavy, light and sparse is clear. A dashed red ring marks the darkest seat and a dashed blue ring the lightest, with their names under the dial.'],
  ['Flow','The band under the dial, same lane, same meaning.']],
 squint:'Blur it and you see one round object with a coloured rim and a small triangle in the middle. It reads as a single thing, an instrument, which the other three do not. The centre is the weakest part: with low figures the triangle collapses to a dot, which is true and says little.',
 cost:['Highest novelty, mid cost. Replaces the rows entirely, so ui/railwire.js, rbRow and the gates that count six .rbar rows all change.','One 204 pixel SVG with 112 dots, 7 wells, 21 arcs. Four small chips under it hold the four figures and are the touch targets.','Shares its language with the Field wheel (Root at the top, seat colours, the ring), which is a plus for one visual language and a risk of looking like a copy of the centre.','Closed state is a 50 pixel orrery: legible as a ring, not as a reading.']},
C:{one:'The seven seats run left to right, root to crown, the way the Flow band already runs, and three layers stand on that one axis so a seat reads straight down: its laws, its addresses, what gets through.',
 glance:[
  ['CQ and DQ, one bar','As option A. Below it the same two things are shown by seat.'],
  ['Vitality, awareness, will, radiance','Four tiles in the element colours: a vessel, an iris, an arrow and a sun.'],
  ['CQ by seat','Under each seat, one small bar for each of its laws, tall where held.'],
  ['The 112 addresses','A tray of 3 by 7 slots per seat, filled from the floor. One cell is one address. Bright is clear, black is held. A dashed red outline is the darkest seat, a blue one the lightest.'],
  ['Flow','Directly under the trays on the same seven columns, so a rough stretch of wave sits under the seat that causes it. Seat names under the wave.']],
 squint:'Blur it and you see seven coloured columns over a wave. It is the loudest option and the clearest about why the readings move together: a seat is a column and everything about it is in that column. Too bright for a rail that sits beside the Field, so the cells need toning down.',
 cost:['Medium cost. A different structure from the rows, but only plain rects: 112 cells, 21 bars, one band.','The best answer to tie CQ, DQ and Flow together, because the 21 laws, the 112 addresses and the seven passes are all seated at the same seven seats and here they line up.','Most text in the rail (seat names at 10 pixels). Names are tight in 37 pixel columns, and 3rd Eye is the widest.','Phone: scales by viewBox, readable, long.']},
D:{one:'The 112 addresses are a body: each seat is a slab of dots at its own height on one standing figure whose outline follows the slabs. The readings are placed on the body where they live.',
 glance:[
  ['CQ','The halo of 21 arcs round the head, and on the bar above.'],
  ['DQ','The fog over the body, darker where more is held, and on the bar above with the seven marks across it.'],
  ['Awareness, will, vitality, radiance','The indigo iris at the brow, the blue arrow at the solar seat, the yellow vessel low in the belly, the sun at the heart. The aura behind the whole figure is radiance.'],
  ['The 112 addresses','Light and density on the slabs. A dashed red box is the darkest seat, a blue one the lightest, tagged on the body.'],
  ['Flow','The band under the figure.']],
 squint:'Blur it and you see a person, glowing and with dark patches. It is the quickest read for somebody who has never seen the app (a body with a dark belly says where it is), and the one most likely to be mistaken for the avatar, which is meant to be the centrepiece.',
 cost:['Highest build cost. A silhouette path, seven lattice slabs, four overlay buttons so each reading is a 44 pixel target.','Competes with the Character page and the avatar for the idea of a figure, so it needs a ruling on whether the left menu may carry one.','Smallest type of the four (names at 11 pixels around a figure), and the figure is a medical looking diagram to some readers.','Closed state is a 50 pixel figure: recognisable, small.']}
};
const img=(f,alt,w)=>`<a href="shots/${f}"><img src="shots/${f}" alt="${alt}"${w?` width="${w}"`:''} loading="lazy"></a>`;
const m=(o,p)=>M[o][p];
let h=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Left menu options</title>
<style>
@font-face{font-family:Inter;font-weight:300 700;src:url(inter.woff2) format('woff2')}
:root{--bg:#0C0D12;--panel:#1A1D26;--ink:#EFEDE8;--mid:#B4B0A8;--dim:#94908A;--edge:rgba(255,255,255,.09);--acc:#7EB8D4}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.55 Inter,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
main{max-width:1500px;margin:0 auto;padding:36px 28px 60px}h1{font-size:28px;margin:0 0 6px;font-weight:600;letter-spacing:-.01em}h2{font-size:21px;margin:46px 0 6px;font-weight:600}h3{font-size:16px;margin:0 0 6px}
.lede{color:var(--mid);max-width:76ch;margin:0 0 10px}.note{color:var(--dim);font-size:13px}
.card{background:var(--panel);border:1px solid var(--edge);border-radius:16px;padding:22px 24px 24px;margin:20px 0}
.imgs{display:flex;gap:20px;flex-wrap:wrap;align-items:flex-start;margin:14px 0 18px}.imgs figure{margin:0}.imgs img{display:block;border-radius:12px;border:1px solid var(--edge);max-width:100%;height:auto}
figcaption{font-size:12.5px;color:var(--dim);margin-top:6px}
.cols{display:grid;grid-template-columns:1.25fr 1fr 1fr;gap:28px}@media(max-width:1100px){.cols{grid-template-columns:1fr}}
.glance dt{font-weight:600;font-size:13.5px;margin-top:10px;color:var(--ink)}.glance dd{margin:2px 0 0;color:var(--mid);font-size:14px}
ul{margin:6px 0 0;padding-left:18px;color:var(--mid);font-size:14px}li{margin:5px 0}
.sq{background:rgba(126,184,212,.06);box-shadow:inset 0 0 0 1px rgba(126,184,212,.24);border-radius:11px;padding:12px 14px;color:var(--mid);font-size:14px;margin-top:6px}
.over{display:grid;grid-template-columns:repeat(4,minmax(0,302px));gap:20px;overflow-x:auto;padding-bottom:6px}.over figure{margin:0}.over img{width:100%;height:auto;border-radius:12px;border:1px solid var(--edge);display:block}
table{border-collapse:collapse;width:100%;font-size:14px;margin-top:10px}th,td{text-align:left;padding:9px 12px;border-bottom:1px solid var(--edge);vertical-align:top}th{color:var(--dim);font-weight:500;font-size:12.5px}td.n{font-variant-numeric:tabular-nums}
a{color:var(--acc)}.links a{margin-right:16px;font-size:14px}.pill{display:inline-block;font-size:12px;color:var(--dim);border:1px solid var(--edge);border-radius:999px;padding:1px 10px;margin-right:6px}
img{max-width:100%}
.rules li{margin:6px 0}
</style></head><body><main>
<h1>Left menu: four options</h1>
<p class="lede">Round OR, with the owner's rulings from rounds OT and OV folded in. Four different structures for the left column, each drawn on the real page (a screenshot of the built app with the left column emptied), on three example people, open, closed and at 390 wide. Everything is in motion from the first frame. Mockups only: nothing in atuned_src/ changed, nothing built, nothing pushed. The figures come from the built page on 1 October 2026.</p>
<p class="note">Each rail page is live and moving. Add ?p=marcus, ?p=diane or ?p=tomas, ?s=closed, ?v=390, ?still=1 for the end state with no motion.</p>

<h2>What every option does now</h2>
<ul class="rules">
<li><b>CQ and DQ are the only names on screen.</b> The full words, coherence and decoherence, live in the tooltips. On a phone a tooltip is not a route, so the bar should open its reading in the right panel on a press, the way an item does in the Awareness section.</li>
<li><b>One bar for CQ and DQ.</b> CQ at the left end, DQ at the right, a gradient pulled between them. The seven seat marks of DQ run the whole width of the bar. The white line is placed by how far the person oscillates, using the one oscillation measure the engine has (cqRange in ui/personas.js, the Compass's own). It moves slowly, the way the Compass marker does. Three ways of placing the line are on the line explainer below, because the measure is a width and not a position.</li>
<li><b>Colours are the elements.</b> Vitality yellow, awareness indigo, will blue. Radiance is the three together, a sun with a ray in each.</li>
<li><b>Flow is measured along CQ against SQ.</b> The wave runs root to crown along the 21 laws, which are seated at the same seven seats as the 112 addresses. The lane it may use is as tall as CQ. Level and roughness inside the lane come from SQ at each seat. Speed comes from DQ. In the engine Flow is SQ only, so the lane is a drawing choice until you say otherwise (see the flow explainer).</li>
<li><b>Benign is a halo, malignant is a pitchfork,</b> in line and ring, no fill.</li>
<li><b>The Awareness section</b> loses the legend line under the four roots. The top items stand out as larger tiles, every group folds and keeps its top items in its header, and a press on any item shows it in the right panel. See the full page picture below.</li>
<li><b>Nothing draws across to the centre.</b> The celestial map is untouched: it lives inside the folded Root Energetics header at the top of every rail, as built.</li>
</ul>

<h2>The four side by side, open, 1600 by 1000</h2>
<p class="note">Marcus, a creative director: CQ 62, DQ 11, Flow 1.00. A clear person, so the differences between seats are small.</p>
<div class="over">${'ABCD'.split('').map(o=>`<figure>${img(o+'-rail-marcus.png','Option '+o+' for Marcus')}<figcaption><b>${o}</b> ${names[o]}</figcaption></figure>`).join('')}</div>
<p class="note" style="margin-top:18px">Tomas, a long haul driver: CQ 31, DQ 53, Flow 0.00. A heavy person, so the darkest and lightest seats and the choppy wave show.</p>
<div class="over">${'ABCD'.split('').map(o=>`<figure>${img(o+'-rail-tomas.png','Option '+o+' for Tomas')}<figcaption><b>${o}</b> ${names[o]}</figcaption></figure>`).join('')}</div>
<p class="note" style="margin-top:18px">The built rail today, for comparison (Marcus and Tomas): <a href="baseline-1600-marcus.png">Marcus</a>, <a href="baseline-1600-tomas.png">Tomas</a>, <a href="../rail-combined/10-crop-bars-dials-marcus.png">the six bars cropped</a>.</p>

<h2>The first screen, measured</h2>
<p class="lede">Measured on these pages at 1600 by 1000 with the column open and Awareness folded. The archetype row is the second line of the Energy section. The panel ends at ${BASE.panel}.</p>
<table><tr><th></th><th>Interactive controls on the first screen</th><th>Archetype row ends at</th><th>Controls under 44 by 44</th><th>Rail scrolls</th></tr>
<tr><td>The built rail</td><td class="n">${BASE.choices}</td><td class="n">${BASE.archBottom} (starts at ${BASE.archTop}, touching the edge)</td><td class="n">not measured</td><td>no</td></tr>
${'ABCD'.split('').map(o=>`<tr><td>${o} ${names[o]}</td><td class="n">${m(o,'marcus').choices}</td><td class="n">${m(o,'marcus').archBottom}, ${BASE.panel-m(o,'marcus').archBottom} pixels clear</td><td class="n">${m(o,'marcus').small.length}</td><td>${m(o,'marcus').scrollH>m(o,'marcus').clientH?'yes':'no'}</td></tr>`).join('')}</table>
<p class="note">The target is under 12 simultaneous choices and none under 44 by 44. All four are under 12, and the Style switch is a 44 pixel pair now. Each page is shown moving between two frames taken 900 milliseconds apart; the pixels differ in all four, including Marcus, whose wave and lamps still run.</p>

<h2>The four options</h2>`;
for(const o of 'ABCD'){
 const d=opts[o];
 h+=`<div class="card"><h3>${o}. ${names[o]}</h3><p class="lede" style="margin-bottom:6px">${d.one}</p>
 <div class="links"><a href="rail-${o}.html?p=marcus">Live, Marcus</a><a href="rail-${o}.html?p=tomas">Live, Tomas</a><a href="rail-${o}.html?p=diane">Live, Diane</a><a href="rail-${o}.html?p=tomas&s=closed">Closed</a><a href="rail-${o}.html?p=tomas&v=390">Phone</a></div>
 <div class="imgs"><figure>${img(o+'-rail-marcus.png',o+' Marcus',302)}<figcaption>Marcus, open</figcaption></figure><figure>${img(o+'-rail-tomas.png',o+' Tomas',302)}<figcaption>Tomas, open</figcaption></figure><figure>${img(o+'-rail-diane.png',o+' Diane',302)}<figcaption>Diane, open</figcaption></figure>
 <figure>${img(o+'-closed-marcus.png',o+' closed Marcus',58)}<figcaption>Closed, Marcus</figcaption></figure><figure>${img(o+'-closed-tomas.png',o+' closed Tomas',58)}<figcaption>Closed, Tomas</figcaption></figure>
 <figure>${img(o+'-390-open-tomas.png',o+' phone Tomas',300)}<figcaption>390 wide, Tomas</figcaption>${img(o+'-390-closed-tomas.png',o+' phone closed',300)}<figcaption>390, closed</figcaption></figure></div>
 <div class="cols"><div><h3>What a person reads at a glance</h3><dl class="glance">${d.glance.map(g=>`<dt>${g[0]}</dt><dd>${g[1]}</dd>`).join('')}</dl></div>
 <div><h3>Squint test</h3><div class="sq">${d.squint}</div><h3 style="margin-top:16px">First frame</h3><p style="color:var(--mid);font-size:14px;margin:4px 0 0">Moving from the first frame in all states, quietly: the wave runs at the Field's rate for the person's DQ, the line on the bar swings, the vessel surface drifts, the iris and sun turn slowly, the lamps breathe at their seat phase, loaded addresses pulse. Closed, the strip keeps the bar, the four forms and a standing wave. Reduced motion draws the end state.</p></div>
 <div><h3>Cost notes</h3><ul>${d.cost.map(c=>`<li>${c}</li>`).join('')}</ul></div></div></div>`;
}
h+=`<h2>Awareness opened, and the right panel</h2>
<p class="lede">Round OT, item 6. The legend under the four roots (the line that said "pale, something you picked is in here", written by syncSoul into #rootlegend in ui/panels.js) is gone. A root that holds one of your picks is lit in its own colour with a dot, so nothing needs a sentence. The strongest three blueprint domains are tiles, the rest are quiet circles behind a fold. Primary and secondary each show their one pick and fold, and a folded group keeps its pick in its header. Here Weaver has been pressed: it opens in Summary on the right, Summary sits above Reading, Summary starts open and Reading starts closed.</p>
<div class="imgs"><figure>${img('full-awareness-marcus.png','Awareness open with Weaver in the right panel, Marcus',900)}<figcaption>Full page, Marcus, Weaver pressed. The rail is scrolled to the Energy section.</figcaption></figure>
<figure>${img('awareness-390-marcus.png','Awareness on a phone',300)}<figcaption>The same on a phone, in the stacked rail.</figcaption></figure></div>

<h2>The explainers</h2>
<p class="lede">You said you did not understand two earlier questions, so each has a picture and a plain caption. Two more are here for the new questions the rounds raised.</p>
<div class="imgs">
<figure>${img('explain-style.png','The Style switch',560)}<figcaption>The Bar and Arc Style switch: same data, two drawings.</figcaption></figure>
<figure>${img('explain-hash.png','The DQ marks, strict and doubled',560)}<figcaption>The seven DQ marks, strict one to one against doubled, now across the whole bar.</figcaption></figure>
<figure>${img('explain-line.png','Where the line sits',560)}<figcaption>Where the line on the CQ and DQ bar sits: three rules.</figcaption></figure>
<figure>${img('explain-flow.png','The Flow band',560)}<figcaption>The Flow band: CQ sets the lane, SQ sets the level.</figcaption></figure></div>
<p class="links"><a href="explain-style.html">Style, live</a><a href="explain-hash.html">DQ marks, live</a><a href="explain-line.html">Line, live</a><a href="explain-flow.html">Flow, live</a></p>

<h2>Cost and risk, side by side</h2>
<table><tr><th></th><th>Build cost</th><th>What it replaces</th><th>Biggest risk</th><th>Reads best for</th></tr>
<tr><td>A, the spine</td><td>Low</td><td>The wire and the bar fills; rows stay</td><td>Still a list, so the least new meaning</td><td>Level 4 and 5 buyers who still need the names (Angela, Diane)</td></tr>
<tr><td>B, the orrery</td><td>Medium</td><td>All six rows and the wire</td><td>Looks like a second Field wheel</td><td>People who read a picture before a word (Marcus, Sofia)</td></tr>
<tr><td>C, the common axis</td><td>Medium</td><td>The rows; adds a seat axis</td><td>Loud next to the Field, small type</td><td>Derek and James, who want the structure and the cause</td></tr>
<tr><td>D, the figure</td><td>High</td><td>The rows and the wire</td><td>Competes with the avatar, smallest type</td><td>A stranger's first four seconds, Angela</td></tr></table>
<p class="note">Dated 1 October 2026. The numbers above are read off shots/measure.json by mksheet.js, so rerun measure.js and mksheet.js after any change.</p>
</main></body></html>`;
fs.writeFileSync(path.join(DIR,'index.html'),h);
console.log('wrote index.html',h.length);
