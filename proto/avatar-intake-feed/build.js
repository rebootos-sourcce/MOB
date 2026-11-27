/* ============================================================
   ROUND HS. FOUR QUESTIONS HE ASKED, ANSWERED WITH DRAWINGS.

   His words, TASKS.md round HS: "Should the 63 questions intake feed the
   avatar's field? It's a great question. Um, mock that up. I need to see
   it. Two archetypes exist in the same page. I don't understand that. I
   need context." And: "these radial designs, I like them, I don't
   understand them, like if you've got caregiver selected, so many things
   happening." And the column law he stated in the same dictation.

   One page, one in-page switch, because a comparison is one file with an
   in-page switch (DECISIONS.md, "Working rules from the night"). It wears
   no tab bar of the real app and says on the page that it is a prototype.

   Nothing is invented where the product already has it:
     the seven areas, their angles and icons   atuned_src/ui/avatarui.js
     archetype, law, family and seat icons     engine.js (ARCH, SI, HCX_LIB,
                                               CHILD, PAL)
     Angela's law answers and her picks        engine.js (LAWSET, PEOPLE)
     the pairs                                 proto/avatar/seats/pairs.js
     the real screens and their rectangles     real.js, run first
     the typeface                              the @font-face in source.html

   node proto/avatar-intake-feed/build.js  ->  proto/avatar-intake-feed/index.html
   ============================================================ */
const fs=require('fs'), path=require('path'), vm=require('vm'), cp=require('child_process');
const HERE=__dirname, ROOT=path.join(HERE,'..','..');
const E=require(path.join(ROOT,'engine.js'));
const PAIRS=require(path.join(ROOT,'proto/avatar/seats/pairs.js'));

/* the ring's own tables, lifted by name from the committed renderer. HEAD and
   not the working tree, because another seat may be mid edit in that file and
   a drawing should not depend on a half written change. */
const committed=f=>cp.execFileSync('git',['show','HEAD:'+f],{cwd:ROOT,encoding:'utf8',maxBuffer:64<<20});
const AVSRC=committed('atuned_src/ui/avatarui.js'), CANON=committed('atuned_src/engine/data/canon.js');
function lift(src,kw,name){
 const m=src.match(new RegExp(kw+' '+name+'=([\\s\\S]*?);\\n'));
 if(!m)throw new Error('not found: '+name);
 return vm.runInNewContext('('+m[1]+')');}
const AV_AREAS=lift(AVSRC,'var','AV_AREAS'), AV_IC=lift(AVSRC,'var','AV_IC'),
 AV_DEF=lift(AVSRC,'var','AV_DEF'), AV_IMPACT=lift(AVSRC,'var','AV_IMPACT');
const SEATGLYPH=lift(CANON,'const','SEATGLYPH');
/* each archetype's primary saboteur (ARCH18, which calls the Rebel the
   Outlaw, as avatarui.js notes) and each saboteur's family (SAB_LIB) */
const SAB={}; E.ARCH18.forEach(r=>{SAB[r[0]==='Outlaw'?'Rebel':r[0]]=r[1];});
const FAM={}; E.SAB_LIB.forEach(s=>{FAM[s.nm]=s.hcx;});

/* the typeface, carried in the page the way the product carries it */
const SRC=fs.readFileSync(path.join(ROOT,'source.html'),'utf8');
const fi=SRC.indexOf('@font-face'), FONT=SRC.slice(fi,SRC.indexOf('}',fi)+1);

/* the real screens, as JPEG so the page stays small */
function jpeg(png){
 const out=png.replace(/\.png$/,'.jpg');
 cp.execFileSync('python3',['-c',
  'import sys;from PIL import Image;Image.open(sys.argv[1]).convert("RGB").save(sys.argv[2],quality=84)',png,out]);
 return 'data:image/jpeg;base64,'+fs.readFileSync(out).toString('base64');}
const SH=path.join(HERE,'shots');
const GEO=JSON.parse(fs.readFileSync(path.join(SH,'real-geo.json'),'utf8'));
const IMG={hero:jpeg(path.join(SH,'real-1600-hero.png')), arch:jpeg(path.join(SH,'real-1600-arch.png')),
 wheel:jpeg(path.join(SH,'real-1600-wheel.png'))};
['hero','arch','wheel'].forEach(k=>{try{fs.unlinkSync(path.join(SH,'real-1600-'+k+'.jpg'));}catch(e){}});

/* Angela. A reference person, level 5 on the grid, the one onboarding is
   written for (BIBLE.md 6.1). Her laws are her reference record. */
const ANG=E.PEOPLE.find(p=>p.nm==='Angela'), LS=E.LAWSET.Angela;
const LAWS=E.SI.map(l=>({nm:l.nm, b:l.b, ic:l.ic, v:(LS[l.nm]!=null?LS[l.nm]:LS._)}));

const DATA={
 PAL:E.PAL, GOLD:'#7EB8D4',
 AREAS:AV_AREAS, AIC:AV_IC,
 ARCH:E.ARCH.map(a=>({nm:a.nm,b:a.b,ic:a.ic})),
 DEF:AV_DEF, IMPACT:AV_IMPACT,
 HCX:E.HCX_LIB.map(h=>({nm:h.nm,b:h.b,ic:h.ic})),
 CHILD:E.CHILD.map(c=>({nm:c.nm,seat:c.seat,ic:c.ic})),
 SEATGLYPH:SEATGLYPH, SAB:SAB, FAM:FAM,
 LAWS:LAWS,
 PICKS:[E.ARCH[ANG.a1].nm, E.ARCH[ANG.a2].nm],
 PAIRS:PAIRS.Angela,
 GEO:GEO, IMG:IMG};

const html=`<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Avatar questions, round HS</title>
<style>
${FONT}
:root{--bg:#0C0D12;--panel:#1A1D26;--panel-2:#252833;--sunk:#090A0E;--edge:rgba(255,255,255,.09);
 --edge-2:rgba(255,255,255,.14);--ink:#EFEDE8;--mid:#B4B0A8;--dim:#94908A;--accent:#7EB8D4;
 --on-accent:#0B1418;--bad:#D4736D;--good:#68CBA4;--r:16px;--r-s:11px;--r-xs:8px;
 --sans:'Inter',system-ui,-apple-system,'Segoe UI',sans-serif}
*{box-sizing:border-box}
html,body{margin:0;background:var(--bg);color:var(--ink);font:400 16px/1.5 var(--sans);
 font-feature-settings:'tnum' 1}
button{font:inherit;color:inherit}
.bar{position:sticky;top:0;z-index:20;background:var(--sunk);border-bottom:1px solid var(--edge);
 padding:10px 16px;display:flex;flex-wrap:wrap;gap:10px 16px;align-items:center}
.proto{border:1px dashed var(--accent);color:var(--accent);border-radius:999px;padding:3px 10px;
 font-size:12px;font-weight:600}
.bar .t{font-weight:600;font-size:15px}
.seg{display:flex;flex-wrap:wrap;gap:6px}
.seg button,.sub button,.tog{min-height:44px;padding:0 14px;border-radius:var(--r-s);
 border:1px solid var(--edge-2);background:transparent;cursor:pointer;font-size:14px}
.seg button[aria-pressed=true],.sub button[aria-pressed=true]{background:var(--accent);
 color:var(--on-accent);border-color:var(--accent);font-weight:600}
.tog{margin-left:auto}
.tog[aria-pressed=true]{border-color:var(--accent);color:var(--accent)}
main{max-width:1480px;margin:0 auto;padding:20px 16px 60px}
.view{display:none}.view.on{display:block}
h1{font-size:26px;line-height:1.25;font-weight:600;margin:4px 0 6px}
.his{color:var(--mid);font-size:15px;max-width:75ch;margin:0 0 18px}
.his b{color:var(--ink);font-weight:500}
h2{font-size:18px;font-weight:600;margin:28px 0 10px}
p{max-width:75ch}
.note{color:var(--mid);font-size:15px}
.sub{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 14px}

/* THE FRAME. Three columns and the band below the art, the column law
   drawn as a layout: tools left, the graphic centre, text right. */
.frame{display:grid;grid-template-columns:260px minmax(0,1fr) 320px;gap:10px;align-items:start}
.col{background:var(--panel);border-radius:var(--r);padding:16px;position:relative;min-width:0}
.col.art{background:#101010}
.below{margin-top:14px;padding-top:14px;border-top:1px solid var(--edge);position:relative}
body.cols .col,body.cols .below{outline:1px dashed rgba(126,184,212,.7);outline-offset:3px}
body.cols [data-z]::before{content:attr(data-z);position:absolute;top:-11px;left:12px;
 background:var(--bg);color:var(--accent);font-size:12px;font-weight:600;padding:0 6px;border-radius:6px}
body.cols .below[data-z]::before{top:-10px;background:#101010}
.eye{font-size:12px;font-weight:600;color:var(--dim);margin:0 0 8px;text-transform:capitalize}
.art svg.ring{display:block;width:100%;max-width:560px;margin:0 auto}
@media (max-width:1180px){.frame{grid-template-columns:1fr}.col.art{order:-1}}
/* drawn labels keep the 11px floor on a phone: a viewBox scales them down with the drawing */
@media (max-width:720px){svg.ring .lb{font-size:3.4px}}

/* labels carry their own symbol, the rule this round wrote down */
.lab{display:inline-flex;align-items:center;gap:8px;min-width:0}
.ic{width:28px;height:28px;flex:none;border-radius:50%;display:grid;place-items:center;
 border:1.5px solid var(--c,var(--edge-2))}
.ic svg{width:16px;height:16px;fill:none;stroke:var(--c,var(--mid));stroke-width:1.8;
 stroke-linecap:round;stroke-linejoin:round}
.ic.sm{width:22px;height:22px}.ic.sm svg{width:13px;height:13px}
.nm{font-weight:600}
.card{background:var(--panel-2);border-radius:var(--r-s);padding:14px;margin:0 0 10px}
.card:last-child{margin-bottom:0}
.hd{display:flex;align-items:center;gap:10px;margin:0 0 10px}
.hd .pc{margin-left:auto;font-size:22px;font-weight:500}
.hd .pc small{display:block;font-size:12px;color:var(--dim);text-align:right}
.big{font-size:20px;font-weight:600;line-height:1.2}
.sm-t{font-size:13px;color:var(--dim)}
.pl{font-size:12px;font-weight:600;color:var(--dim);margin:10px 0 2px}
.pv{margin:0 0 4px}
.tags{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0 0}
.tag{display:inline-flex;align-items:center;gap:6px;min-height:32px;padding:0 10px 0 6px;border-radius:999px;
 border:1px solid var(--edge-2);font-size:14px}
.tag.w{padding-left:10px;color:var(--mid)}
.tag.on{border-color:var(--c)}
.tag .ic{width:20px;height:20px;border:none}.tag .ic svg{width:14px;height:14px}
.quote{background:var(--sunk);border-radius:var(--r-xs);padding:10px 12px;margin:6px 0 0;font-size:15px}
.quote b{font-weight:600}.quote .m{display:block;font-size:12px;color:var(--dim);margin-top:4px}
.f{display:block;margin:0 0 10px}
.f span{display:block;font-size:12px;font-weight:600;color:var(--dim);margin:0 0 4px}
.f input{width:100%;min-height:44px;border-radius:var(--r-xs);border:1px solid var(--edge-2);
 background:var(--sunk);color:var(--ink);padding:0 10px;font:inherit;font-size:14px}
.btn{min-height:44px;padding:0 16px;border-radius:999px;border:1px solid var(--edge-2);background:transparent;
 font-size:15px;cursor:pointer}
.btn.pri{background:var(--accent);color:var(--on-accent);border-color:var(--accent);font-weight:600}
.btn[disabled]{opacity:.45;cursor:default}
.acts{display:flex;flex-wrap:wrap;gap:8px}
.chips{display:flex;flex-direction:column;gap:6px}
.chip{display:flex;align-items:center;gap:8px;min-height:44px;width:100%;padding:0 10px;border-radius:var(--r-s);
 border:1px solid var(--edge-2);background:transparent;text-align:left;cursor:pointer;font-size:14px}
.chip .v{margin-left:auto;font-weight:500}
.chip[aria-pressed=true]{border-color:var(--c);background:color-mix(in srgb,var(--c) 12%,transparent)}
/* a 0 to 10 scale is eleven equal cells, four to six in a slightly different fill, five marked */
.lawrow{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:8px 10px;margin:0 0 8px}
.cells{grid-column:1/-1;display:grid;grid-template-columns:repeat(11,1fr);gap:2px}
.cells i{height:8px;border-radius:2px;background:rgba(255,255,255,.07)}
.cells i.band{background:rgba(255,255,255,.12)}
.cells i.five{box-shadow:inset 0 -2px 0 var(--mid)}
.cells i.on{background:var(--c)}
.band-strip{display:flex;flex-wrap:wrap;gap:8px}

/* annotation, which is the team talking to him and never product copy */
.ann{background:var(--panel);border:1px solid var(--edge);border-radius:var(--r);padding:16px 18px;margin:14px 0 0}
.ann h3{font-size:15px;font-weight:600;margin:0 0 8px}
.ann ul,.ann ol{margin:0;padding-left:20px}.ann li{margin:0 0 6px;max-width:80ch}
.grid3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
@media (max-width:900px){.grid3{grid-template-columns:1fr}}
.rec{border-color:var(--accent)}
.rec .k{color:var(--accent);font-weight:600}
.shot{position:relative;border-radius:var(--r-s);overflow:hidden;border:1px solid var(--edge)}
.shot img{display:block;width:100%;height:auto}
.box{position:absolute;border:2px solid var(--accent);border-radius:8px;pointer-events:none}
.box.bad{border-color:var(--bad)}.box.dash{border-style:dashed}
.box b{position:absolute;top:-2px;left:-2px;transform:translate(-40%,-40%);min-width:26px;height:26px;border-radius:13px;
 background:var(--accent);color:var(--on-accent);font-size:14px;display:grid;place-items:center;padding:0 6px}
.box.bad b{background:var(--bad);color:#1a0d0c}
.box em{position:absolute;left:0;bottom:100%;margin-bottom:4px;font-style:normal;font-size:12px;font-weight:600;
 background:rgba(9,10,14,.92);color:var(--accent);padding:2px 8px;border-radius:6px;white-space:nowrap}
.box.bad em{color:var(--bad)}
@media (max-width:720px){.box em{display:none}}
table{border-collapse:collapse;width:100%;font-size:14px}
th,td{text-align:left;vertical-align:top;padding:8px 10px;border-bottom:1px solid var(--edge)}
th{color:var(--dim);font-weight:600;font-size:12px}
.tw{overflow-x:auto}
.num{display:inline-grid;place-items:center;min-width:24px;height:24px;border-radius:12px;background:var(--accent);
 color:var(--on-accent);font-size:13px;font-weight:600;margin-right:6px;padding:0 6px}
.num.bad{background:var(--bad);color:#1a0d0c}
.yes{color:var(--ink)}.no{color:var(--dim)}
.two{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);gap:14px;align-items:start}
@media (max-width:1100px){.two{grid-template-columns:1fr}}
.scale{display:flex;align-items:center;justify-content:space-between;position:relative;margin:6px 0 2px}
.scale::before{content:'';position:absolute;left:22px;right:22px;top:50%;height:2px;background:var(--edge-2)}
.scale button{position:relative;width:44px;height:44px;border-radius:50%;border:1.5px solid var(--c);background:var(--panel);
 font-weight:600;cursor:pointer}
.scale button.on{background:color-mix(in srgb,var(--c) 22%,var(--panel))}
.scale button.at{background:var(--c);color:#0b1418}
.ends{display:flex;justify-content:space-between;font-size:13px;color:var(--dim)}
.meas td:first-child{color:var(--mid)}
</style></head>
<body class="cols">
<div class="bar">
 <span class="proto">Prototype</span>
 <span class="t">The avatar, four questions from round HS</span>
 <div class="seg" role="group" aria-label="Question">
  <button data-v="col" aria-pressed="true">Column law</button>
  <button data-v="feed" aria-pressed="false">Intake and avatar</button>
  <button data-v="arch" aria-pressed="false">Two archetypes</button>
  <button data-v="wheel" aria-pressed="false">Archetype wheel</button>
 </div>
 <button class="tog" id="tog" aria-pressed="true">Columns shown</button>
</div>
<main>

<section class="view on" id="v-col">
 <h1>The centre column is for the graphic</h1>
 <p class="his">His words: <b>"The center column is sacrosanct for art. Not for text. The right column is for text.
 The bottom underneath the art is for text. Or design. The left is for a tools."</b> Below: the real Avatar tab as it
 ships, then the same screen with the law applied. Same pairs. The shot reads 0% because a profile made for the shot keeps no starting weight; the drawing uses the 13, 16 and 24 percent round HG's own shot of these pairs read.</p>
 <h2>As it ships</h2>
 <div class="shot" id="shot-hero"><img alt="The real Avatar tab at 1600 pixels wide" src="${IMG.hero}"></div>
 <div class="ann"><h3>What the boxes mark</h3><ol>
  <li><span class="num">1</span>The centre column. 922 pixels wide with the left column open.</li>
  <li><span class="num">2</span>The graphic: the ring of seven areas. 440 pixels wide, 17 words.</li>
  <li><span class="num bad">3</span>A text panel beside the graphic, in the same band, inside the centre column. 418 pixels wide, 92 words. This is the card he named: "do not sideline them by a panel."</li>
  <li><span class="num bad">4</span>Text above the graphic, 36 words. The law names text below the art and does not name text above it, so this one is his to rule.</li>
  <li><span class="num">5</span>The right column, the one meant for text. It shows the Energetic Summary, which is not about the avatar.</li>
 </ol></div>
 <h2>The law applied to this screen</h2>
 <div class="frame" id="f-col"></div>
 <div class="ann"><h3>What moved</h3><ul>
  <li>The pair panel went right, into the one detail host the right column already carries. Nothing sits beside the ring.</li>
  <li>The two lines and the release went left. Both write something, so both are tools.</li>
  <li>The pairs written went below the art. That band is for text or design.</li>
  <li>Every label that names a concept wears its symbol, including the fetter <b>fear</b>, which ships today as a bare word.</li>
 </ul></div>
</section>

<section class="view" id="v-feed">
 <h1>Should the 63 questions feed the avatar?</h1>
 <p class="his">His words: <b>"Should the 63 questions intake feed the avatar's field? It's a great question. Um, mock that up."</b>
 Three ways, drawn on one person. Angela, a reference profile, level 5 on the buyer grid. Her answers put Truth at 2.6,
 Humility at 2.1 and Accountability at 3.2, each out of 10. The Voice area, at the throat, is selected in all three.
 She has written nothing there.</p>
 <div class="sub" role="group" aria-label="Way">
  <button data-o="a" aria-pressed="true">A. Separate, as today</button>
  <button data-o="b" aria-pressed="false">B. Shown on the ring</button>
  <button data-o="c" aria-pressed="false">C. Suggested into a pair</button>
 </div>
 <div class="frame" id="f-feed"></div>
 <div class="ann" id="feed-cost"></div>
 <div class="ann rec"><h3>The team's recommendation: B</h3><ul>
  <li><span class="k">It joins the two without writing anything.</span> The answers are drawn where the avatar is being worked on. The person decides what, if anything, to write about them.</li>
  <li><span class="k">It builds on what exists.</span> The intake already scores each law. No new field on the record, so no schema change.</li>
  <li><span class="k">C nominates a lack.</span> A chip under "From your answers" reading "Truth, the throat, 2.6" tells a person where they fall short, and asks them to write about it. The Bible names a false positive on the lack side as the one error the product cannot afford (6.4, item 13). James, who closes the tab on anything that accuses, is the person it loses.</li>
  <li><span class="k">Not drawn, and refused:</span> the answers writing the words of a pair. The product may find, cut and mark a person's words. It may not write them (Bible 9.4).</li>
 </ul></div>
</section>

<section class="view" id="v-arch">
 <h1>Two archetypes on one page</h1>
 <p class="his">His words: <b>"Two archetypes exist in the same page. I don't understand that. I need context."</b>
 The real Avatar tab, scrolled to the wheel, with the left column open. Four places name archetypes on this one screen.
 Only one of them changes the reading.</p>
 <div class="shot" id="shot-arch"><img alt="The real Avatar tab, the archetype wheel and both rails" src="${IMG.arch}"></div>
 <div class="ann"><h3>What each one is</h3><div class="tw"><table>
  <tr><th></th><th>Where</th><th>What it is</th><th>Kept</th><th>Moves the reading</th><th>Moves the avatar</th></tr>
  <tr><td><span class="num">1</span></td><td>Left column, Primary and Secondary</td><td>The archetypes you pick as yours. Here: Warrior and Sage.</td><td>In the record</td><td class="yes">Yes. It builds the blueprint ring, which sets how strongly each of the 112 addresses takes charge</td><td class="no">No</td></tr>
  <tr><td><span class="num">2</span></td><td>Right column, Archetypes, first to third. Also the glow on the wheel's marks</td><td>Pick 1, read back. It is computed from the picks and the blueprint domains, not from any story.</td><td>Not kept. Computed each time</td><td class="no">No</td><td class="no">No</td></tr>
  <tr><td><span class="num">3</span></td><td>Centre, the wheel and the one to five scale</td><td>How much of each archetype is you, one to five. Round HG. Here: Caregiver 4, Magician 2.</td><td>Beside the record, on this device only</td><td class="no">No. Nothing in the engine reads it</td><td class="yes">Only the icon at the ring's core</td></tr>
  <tr><td><span class="num bad">4</span></td><td>Centre, under the scale</td><td>"Your field reads Warrior first." It sets 3 against 2, and 2 is 1 read back.</td><td></td><td></td><td></td></tr>
 </table></div>
 <p class="note">Measured on this profile: the reading puts Warrior at 1.00 and Sage at 0.72, the two picks. Innocent reads 0.71, from a blueprint domain. So the sentence in 4 compares what you rated against what you picked, and calls the pick your field.</p>
 </div>
 <h2>Ways it could go. His call</h2>
 <div class="grid3">
  <div class="ann"><h3>1. One input</h3><p>The one to five scale becomes the archetype input and builds the blueprint ring. The left column's picks go.</p><p class="note">Costs: the ratings move into the record, which is a schema change and his. Every reading moves once, on the day it switches.</p></div>
  <div class="ann"><h3>2. Two inputs, kept apart</h3><p>The picks stay as the blueprint, the scale stays as the avatar's. Neither is shown as a reading of the other, so 2 and 4 stop calling the pick your field.</p><p class="note">Costs: a person still meets the twelve twice on one tab, with two meanings.</p></div>
  <div class="ann"><h3>3. The field reads its own</h3><p>The scale stays as the person's own say. The field's archetype read comes from what the stories carry, so 4 becomes a real comparison.</p><p class="note">Costs: new engine work. No story reads an archetype today.</p></div>
 </div>
 <div class="ann rec"><p><span class="k">True under all three:</span> sentence 4 is not a field reading, and it should not say it is. That changes no mechanism.</p></div>
</section>

<section class="view" id="v-wheel">
 <h1>The archetype wheel, with one selected</h1>
 <p class="his">His words: <b>"these radial designs, I like them, I don't understand them, like if you've got caregiver selected, so many things happening."</b></p>
 <div class="sub" role="group" aria-label="State">
  <button data-w="built" aria-pressed="true">As it ships</button>
  <button data-w="prop" aria-pressed="false">Proposed</button>
 </div>
 <div id="w-built">
  <div class="shot" id="shot-wheel"><img alt="The real archetype wheel with Caregiver selected" src="${IMG.wheel}"></div>
 </div>
 <div id="w-prop" hidden><div class="frame" id="f-wheel"></div></div>
 <div class="two">
  <div class="ann"><h3>What goes, and why</h3><ol>
   <li><span class="num bad">1</span>The seven coloured arcs and seven area icons inside the wheel. They are the avatar ring's seven areas, drawn a second time. One graphic, one job.</li>
   <li><span class="num bad">2</span>The glow on each mark. It is the left column's pick read back (see Two archetypes). It returns only if he rules that the pick is the reading.</li>
   <li><span class="num bad">3</span>The area name under the core. The colour and the icon already carry the seat.</li>
   <li><span class="num bad">4</span>"Primary saboteur, at the heart." The saboteur's own symbol and colour carry it.</li>
   <li><span class="num bad">5</span>"One press sets it. The same press again takes it off." It describes the control, which a section may not do (Bible 1.4).</li>
   <li><span class="num bad">6</span>"Your field reads Warrior first." It compares the scale with the pick. Held until the two archetypes question is ruled.</li>
  </ol>
  <p class="note">What stays: the twelve, each with its icon and name; the number a person set, as a pill; the selection; one sentence on what the archetype does; the saboteur it runs with, with its symbol and one sentence on what it costs. The scale moves to the left column, because it writes.</p></div>
  <div class="ann"><h3>Measured</h3><div class="tw"><table class="meas">
   <tr><th></th><th>As it ships</th><th>Proposed</th></tr>
   <tr><td>Choices</td><td>17</td><td id="m-ctl">17</td></tr>
   <tr><td>Words</td><td>91</td><td id="m-wd"></td></tr>
   <tr><td>Things the wheel means</td><td>7</td><td>3</td></tr>
  </table></div>
  <p class="note">Choices do not fall, and should not: twelve archetypes and five points are the roster and his scale. Hick's law prices a choice among twelve at about 3.7 bits either way. What he is reacting to is what the eye sorts before it can choose. The wheel meant seven things at once (archetype, area arc, area icon, glow, rating, selection, core seat) and now means three (archetype, rating, selection).</p>
  <p class="note">"As it ships" is read off the build committed at a0d90b3. "Proposed" is counted by this page from its own frame.</p></div>
 </div>
</section>
</main>
<script>
var D=${JSON.stringify(DATA)};
function el(id){return document.getElementById(id);}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function col(b){return D.PAL[b]||'#94908A';}
function svg(inner){return '<svg viewBox="0 0 24 24" aria-hidden="true">'+inner+'</svg>';}
function pth(d){return '<path d="'+d+'"/>';}
function icon(inner,c,cls){return '<span class="ic'+(cls?' '+cls:'')+'" style="--c:'+c+'">'+svg(inner)+'</span>';}
function areaOf(k){return D.AREAS.filter(function(a){return a.k===k;})[0];}
function areaAt(b){return D.AREAS.filter(function(a){return a.b===b;})[0];}
function archOf(n){return D.ARCH.filter(function(a){return a.nm===n;})[0];}
function lawsAt(b){return D.LAWS.filter(function(l){return l.b===b;});}
var THE={Crown:'the crown','3rd Eye':'the third eye',Throat:'the throat',Heart:'the heart',Solar:'the solar plexus',Sacral:'the sacral',Root:'the root'};
function pos(a,r){var t=a*Math.PI/180;return [50+r*Math.cos(t),50+r*Math.sin(t)];}
function f2(n){return (+n).toFixed(2);}
function arc(cx,cy,r,f){if(f<=0)return ''; if(f>=1)f=.9999; var a0=-Math.PI/2,a1=a0+f*Math.PI*2;
 return 'M'+f2(cx+r*Math.cos(a0))+' '+f2(cy+r*Math.sin(a0))+' A'+r+' '+r+' 0 '+(f>.5?1:0)+' 1 '+f2(cx+r*Math.cos(a1))+' '+f2(cy+r*Math.sin(a1));}

/* THE RING, drawn the way ui/avatarui.js draws it: seven satellites at the
   same angles, a core carrying percent complete. Two optional layers, each
   one of the ways under test: the lowest law answered at each seat as an
   inner arc, and a marker where a law sits under the suggestion line. */
var PCT={love:.24,drive:.16,ground:.13};
function ring(o){
 var s='<svg class="ring" viewBox="0 0 100 100" role="img" aria-label="The avatar ring, seven areas">';
 for(var i=0;i<72;i++){var a=i*5,p0=pos(a,19.2),p1=pos(a,i%6===0?21.4:20.4);
  s+='<line x1="'+f2(p0[0])+'" y1="'+f2(p0[1])+'" x2="'+f2(p1[0])+'" y2="'+f2(p1[1])+'" stroke="rgba(255,255,255,.14)" stroke-width=".25"/>';}
 s+='<circle cx="50" cy="50" r="17.6" fill="none" stroke="rgba(255,255,255,.12)" stroke-width=".7"/>';
 s+='<path d="'+arc(50,50,17.6,.17)+'" fill="none" stroke="'+D.GOLD+'" stroke-width=".9" stroke-linecap="round"/>';
 var top=archOf('Caregiver');
 s+='<g transform="translate(46.6 34.6) scale(.28)" fill="none" stroke="'+col('Heart')+'" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+pth(top.ic)+'</g>';
 s+='<text x="50" y="52.6" text-anchor="middle" font-size="7" font-weight="500" fill="#EFEDE8">17%</text>';
 s+='<text class="lb" x="50" y="57.6" text-anchor="middle" font-size="2.4" fill="#94908A">Complete</text>';
 s+='<text class="lb" x="50" y="61.6" text-anchor="middle" font-size="2.5" fill="'+col('Heart')+'">Caregiver</text>';
 D.AREAS.forEach(function(A){
  var c=pos(A.a,37.5), cc=col(A.b), pc=PCT[A.k], on=o.sel===A.k, R=6.5;
  s+='<circle cx="'+f2(c[0])+'" cy="'+f2(c[1])+'" r="'+R+'" fill="#101010" stroke="'+(pc||on?cc:'rgba(255,255,255,.14)')
   +'" stroke-opacity="'+(on?.95:pc?.4:1)+'" stroke-width="'+(on?.8:.55)+'"/>';
  if(pc)s+='<path d="'+arc(c[0],c[1],R,pc)+'" fill="none" stroke="'+cc+'" stroke-width=".9" stroke-linecap="round"/>';
  if(o.laws){var lo=Math.min.apply(null,lawsAt(A.b).map(function(l){return l.v;}));
   s+='<circle cx="'+f2(c[0])+'" cy="'+f2(c[1])+'" r="'+(R-2.1)+'" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="1"/>';
   s+='<path d="'+arc(c[0],c[1],R-2.1,lo/10)+'" fill="none" stroke="#EFEDE8" stroke-width="1" stroke-linecap="round"/>';}
  if(o.mark&&lawsAt(A.b).some(function(l){return l.v<4;})){var mp=[c[0]+R*.72,c[1]-R*.72];
   s+='<circle cx="'+f2(mp[0])+'" cy="'+f2(mp[1])+'" r="1.25" fill="'+D.GOLD+'" stroke="#101010" stroke-width=".4"/>';}
  s+='<g transform="translate('+f2(c[0]-2.2)+' '+f2(c[1]-4)+') scale(.1833)" fill="none" stroke="'+cc+'" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+D.AIC[A.k]+'</g>';
  s+='<text x="'+f2(c[0])+'" y="'+f2(c[1]+3.6)+'" class="lb" text-anchor="middle" font-size="2.3" font-weight="500" fill="'+(pc?'#EFEDE8':'#94908A')+'">'+(pc?Math.round(pc*100)+'%':'–')+'</text>';
  var l=pos(A.a,26.6);
  s+='<text x="'+f2(l[0])+'" y="'+f2(l[1]+.8)+'" class="lb" text-anchor="middle" font-size="2.3" fill="'+(on?'#EFEDE8':'#94908A')+'">'+A.nm+'</text>';});
 return s+'</svg>';}

function areaCard(k,pct,body){
 var A=areaOf(k), c=col(A.b);
 return '<div class="card"><div class="hd">'+icon(D.AIC[A.k],c)+'<div><div class="big">'+A.nm+'</div><div class="sm-t">'+esc(A.about)+'</div></div>'
  +'<div class="pc">'+(pct==null?'–':Math.round(pct*100)+'%')+'<small>Complete</small></div></div>'+(body||'')+'</div>';}
function cells(v,c){var h='<div class="cells" aria-hidden="true">';
 for(var i=0;i<=10;i++)h+='<i class="'+(i<=Math.round(v)&&v>0?'on ':'')+(i>=4&&i<=6?'band ':'')+(i===5?'five':'')+'" style="--c:'+c+'"></i>';
 return h+'</div>';}
function lawRows(b){
 var c=col(b);
 return '<div class="pl">Laws at '+THE[b]+'</div>'+lawsAt(b).map(function(l){
  return '<div class="lawrow">'+icon(pth(l.ic),c,'sm')+'<span class="nm">'+l.nm+'</span><span>'+l.v.toFixed(1)+'</span>'+cells(l.v,c)+'</div>';}).join('');}
function form(o){
 o=o||{};
 var h='<div class="eye">Tell it</div>';
 if(o.area){var A=areaOf(o.area);
  h+='<div class="tags" style="margin:0 0 10px"><span class="tag on" style="--c:'+col(A.b)+'">'+icon(D.AIC[A.k],col(A.b))+A.nm+', '+THE[A.b]+'</span>'
   +(o.law?'<span class="tag on" style="--c:'+col(o.law.b)+'">'+icon(pth(o.law.ic),col(o.law.b))+o.law.nm+'</span>':'')+'</div>';}
 h+='<label class="f"><span>Who you want to be</span><input placeholder="A great public speaker. I stand up and the room hears me."></label>'
  +'<label class="f"><span>Who you do not want to be</span><input placeholder="My throat is tight and I am afraid when I stand up in front of the board."></label>'
  +'<div class="acts"><button class="btn pri" disabled>Add to your avatar</button></div>';
 return h;}

/* ---------------- the column law, applied ---------------- */
function drawCol(){
 var ground=areaOf('ground'), gc=col('Root'), fear=D.CHILD.filter(function(x){return x.nm==='Fear';})[0];
 var lead=D.PAIRS[1];
 var right='<div class="eye">Selection</div>'
  +areaCard('ground',.13,
   '<div class="pl">Who you want to be</div><p class="pv">'+esc(lead.be)+'</p>'
   +'<div class="pl">Who you do not want to be</div><p class="pv">“'+esc(lead.notbe)+'”</p>'
   +'<div class="tags"><span class="tag on" style="--c:'+gc+'">'+icon(D.AIC.ground,gc)+'Ground, the root</span>'
   +'<span class="tag w">afraid</span>'
   +'<span class="tag on" style="--c:'+col(fear.seat)+'">'+icon(pth(fear.ic),col(fear.seat))+'fear</span></div>'
   +'<div class="pl">From your journal</div><div class="quote">I keep choosing the same kind of person and I am <b>afraid</b> it is who I am.<span class="m">Today. Heard at the root</span></div>'
   +'<p class="sm-t" style="margin:10px 0 0">2 addresses at the root carry what stands in the way, heaviest Victimhood.</p>');
 var left='<div class="eye">Release</div><div class="acts" style="margin:0 0 18px"><button class="btn pri">Release it</button><button class="btn">Take it off</button></div>'+form();
 var below='<div class="eye">Written</div><div class="chips">'+D.PAIRS.map(function(p,i){
  var k=[null,'ground','drive','love'][i], A=k?areaOf(k):null, c=A?col(A.b):'#94908A';
  return '<div class="chip" style="--c:'+c+'"'+(i===1?' aria-pressed="true"':'')+'>'+(A?icon(D.AIC[k],c,'sm'):icon(D.AIC.person,c,'sm'))
   +'<span>'+esc(p.be)+'</span><span class="v">'+(k?Math.round(PCT[k]*100)+'%':'–')+'</span></div>';}).join('')+'</div>';
 el('f-col').innerHTML='<div class="col" data-z="Tools">'+left+'</div>'
  +'<div class="col art" data-z="Graphic">'+ring({sel:'ground'})+'<div class="below" data-z="Below the art: text or design">'+below+'</div></div>'
  +'<div class="col" data-z="Text">'+right+'</div>';}

/* ---------------- the intake and the avatar ---------------- */
var FEED='a';
function drawFeed(){
 var o=FEED, b='Throat';
 var voice=areaCard('voice',null,(o==='a'?'':lawRows(b))+'<p class="sm-t" style="margin:10px 0 0">Nothing you have written lands here yet.</p>');
 var right='<div class="eye">Selection</div>'+voice;
 var left;
 if(o==='c'){
  var low=D.LAWS.filter(function(l){return l.v<4;}).sort(function(x,y){return x.v-y.v;});
  var truth=low.filter(function(l){return l.nm==='Truth';})[0];
  left=form({area:'voice',law:truth})+'<div class="pl" style="margin-top:16px">From your answers</div><div class="chips">'
   +low.map(function(l){var c=col(l.b);
    return '<button class="chip" style="--c:'+c+'" aria-pressed="'+(l.nm==='Truth')+'">'+icon(pth(l.ic),c,'sm')
     +'<span>'+l.nm+', '+THE[l.b]+'</span><span class="v">'+l.v.toFixed(1)+'</span></button>';}).join('')+'</div>';
 }else left=form();
 var below='';
 if(o==='a'){
  below='<div class="below" data-z="Below the art: text or design"><div class="eye">Energetics, further down the page</div><div class="band-strip">'
   +['Crown','3rd Eye','Throat','Heart','Solar','Sacral','Root'].map(function(s){var c=col(s);
    return '<span class="tag on" style="--c:'+c+'">'+icon(D.SEATGLYPH[s]||D.SEATGLYPH._,c)+s+'</span>';}).join('')
   +'</div></div>';}
 el('f-feed').innerHTML='<div class="col" data-z="Tools">'+left+'</div>'
  +'<div class="col art" data-z="Graphic">'+ring({sel:'voice',laws:o!=='a',mark:o==='c'})+below+'</div>'
  +'<div class="col" data-z="Text">'+right+'</div>';
 var C={
  a:['A. Separate, as today','<li>The ring fills only from the pairs a person writes. The 63 questions sit further down the page and feed coherence (CQ) and nothing on the ring.</li>'
   +'<li>What it costs: the avatar says nothing about what the questions measured. Angela sees her Truth at 2.6 nowhere near the throat she is choosing where to work on.</li>'
   +'<li>What it costs to build: nothing. It ships today.</li>'],
  b:['B. Shown on the ring','<li>Each area carries a second, inner arc: the lowest law she answered at that seat, out of 10. The lowest and not the average, because one closed law dims its whole seat in the engine. The throat, the third eye and the solar plexus read short at a glance.</li>'
   +'<li>The right column lists the laws at the selected seat on the product\\'s own 0 to 10 cells, with 4 to 6 in the band fill and 5 marked.</li>'
   +'<li>Nothing is suggested and nothing is written. A seat with no law answered draws no inner arc, never a default.</li>'
   +'<li>What it costs: one more thing on every satellite, and every area now carries two lengths that mean different things. To build: read only, the scores already exist, no schema change.</li>'],
  c:['C. Suggested into a pair','<li>Everything in B, plus a dot on each area where a law reads under 4, and a list in the left column: "From your answers". Pressing one sets the area and attaches the law as a tag. Both lines stay empty. The person writes them.</li>'
   +'<li>If the words she writes land at another seat, the words win. The instrument reads what she wrote.</li>'
   +'<li>What it costs: a threshold for "low", which is his (4 is drawn here). Keeping the law on the pair is a new field on the record, a schema change, also his. And the risk named in the recommendation below.</li>']};
 el('feed-cost').innerHTML='<h3>'+C[o][0]+'</h3><ul>'+C[o][1]+'</ul>';}

/* ---------------- the wheel, proposed ---------------- */
var RATE={Caregiver:4,Magician:2}, SEL='Caregiver';
function archAngle(a){
 var same=D.ARCH.filter(function(x){return x.b===a.b;}), j=same.indexOf(a), n=same.length;
 return areaAt(a.b).a+(n<2?0:(j-(n-1)/2)*26);}
function wheel(){
 var sel=archOf(SEL), sc=col(sel.b);
 var s='<svg class="ring" viewBox="0 0 100 100" role="img" aria-label="The twelve archetypes">';
 s+='<circle cx="50" cy="50" r="25" fill="none" stroke="rgba(255,255,255,.12)" stroke-width=".6"/>';
 s+='<g transform="translate(44.6 36) scale(.45)" fill="none" stroke="'+sc+'" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">'+pth(sel.ic)+'</g>';
 s+='<text x="50" y="58.5" text-anchor="middle" font-size="4" font-weight="600" fill="#EFEDE8">'+sel.nm+'</text>';
 D.ARCH.forEach(function(a){
  var p=pos(archAngle(a),40), c=col(a.b), on=a===sel, rt=RATE[a.nm];
  s+='<g class="mk" data-mk="'+a.nm+'" style="cursor:pointer" opacity="'+(on?1:.62)+'">'
   +'<circle cx="'+f2(p[0])+'" cy="'+f2(p[1])+'" r="4.6" fill="#101010" stroke="'+c+'" stroke-width="'+(on?.9:.5)+'"/>'
   +'<g transform="translate('+f2(p[0]-2.4)+' '+f2(p[1]-2.4)+') scale(.2)" fill="none" stroke="'+c+'" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+pth(a.ic)+'</g>'
   +'<text x="'+f2(p[0])+'" y="'+f2(p[1]+7.6)+'" class="lb" text-anchor="middle" font-size="2.6" font-weight="'+(on?600:400)+'" fill="'+(on?'#EFEDE8':'#94908A')+'">'+a.nm+'</text>';
  if(rt)s+='<circle cx="'+f2(p[0]+3.5)+'" cy="'+f2(p[1]+3.3)+'" r="1.9" fill="'+c+'"/><text x="'+f2(p[0]+3.5)+'" y="'+f2(p[1]+4.2)+'" text-anchor="middle" font-size="2.4" font-weight="600" fill="#0b1418">'+rt+'</text>';
  s+='<rect x="'+f2(p[0]-5.5)+'" y="'+f2(p[1]-5.5)+'" width="11" height="15" fill="transparent" role="button" aria-label="'+a.nm+'"/></g>';});
 return s+'</svg>';}
function drawWheel(){
 var a=archOf(SEL), c=col(a.b), rt=RATE[a.nm]||0;
 var sab=D.SAB[a.nm], fam=D.HCX.filter(function(h){return h.nm===D.FAM[sab];})[0];
 var left='<div class="eye">How much of this is you</div><div class="scale" role="radiogroup" aria-label="How much of this is you">'
  +[1,2,3,4,5].map(function(n){return '<button role="radio" aria-checked="'+(n===rt)+'" class="'+(n<=rt?'on ':'')+(n===rt?'at':'')+'" style="--c:'+c+'" data-st="'+n+'">'+n+'</button>';}).join('')
  +'</div><div class="ends"><span>Hardly</span><span>Fully</span></div>';
 var right='<div class="eye">Selection</div><div class="card"><div class="hd">'+icon(pth(a.ic),c)+'<div class="big">'+a.nm+'</div></div>'
  +'<p class="pv">'+esc(D.DEF[a.nm]||'')+'</p></div>'
  +(sab?'<div class="card"><div class="hd">'+icon(pth(fam?fam.ic:''),fam?col(fam.b):'#94908A')+'<div class="big">'+sab+'</div></div>'
   +'<p class="pv">'+esc(D.IMPACT[sab]||'')+'</p></div>':'');
 el('f-wheel').innerHTML='<div class="col" data-z="Tools">'+left+'</div>'
  +'<div class="col art" data-z="Graphic">'+wheel()+'</div>'
  +'<div class="col" data-z="Text">'+right+'</div>';
 el('f-wheel').querySelectorAll('[data-mk]').forEach(function(g){g.onclick=function(){SEL=g.dataset.mk;drawWheel();};});
 el('f-wheel').querySelectorAll('[data-st]').forEach(function(b){b.onclick=function(){var n=+b.dataset.st;
  if(RATE[SEL]===n)delete RATE[SEL]; else RATE[SEL]=n; drawWheel();};});
 /* counted from the frame itself, so the figure cannot drift from the drawing */
 var f=el('f-wheel'), ctl=f.querySelectorAll('button,[role=button]').length, words=0;
 var tw=document.createTreeWalker(f,NodeFilter.SHOW_TEXT,null), t;
 while((t=tw.nextNode())){var s=t.textContent.trim(); if(s)words+=s.split(/\\s+/).length;}
 el('m-ctl').textContent=ctl; el('m-wd').textContent=words;}

/* ---------------- the boxes on the real screens ---------------- */
function boxes(host,W,H,list){
 var h=el(host); list.forEach(function(b){
  var d=document.createElement('div'); d.className='box'+(b.bad?' bad':'')+(b.dash?' dash':'');
  d.style.left=(b.x/W*100)+'%'; d.style.top=(b.y/H*100)+'%';
  d.style.width=(b.w/W*100)+'%'; d.style.height=(b.h/H*100)+'%';
  d.innerHTML='<b>'+b.n+'</b>'+(b.t?'<em>'+b.t+'</em>':''); h.appendChild(d);});}
var G=D.GEO;
boxes('shot-hero',1600,1000,[
 {n:1,x:G.hero.stage.x,y:G.hero.stage.y,w:G.hero.stage.w,h:G.hero.stage.h,dash:1},
 {n:2,x:G.hero.ring.x,y:G.hero.ring.y,w:G.hero.ring.w,h:G.hero.ring.h,t:'The graphic'},
 {n:3,x:G.hero.side.x-4,y:G.hero.side.y-4,w:G.hero.side.w+8,h:G.hero.side.h+8,bad:1,t:'Text beside the graphic'},
 {n:4,x:G.hero.head.x-4,y:G.hero.head.y,w:G.hero.head.w-120,h:G.hero.head.h,bad:1,dash:1,t:'Text above the graphic'},
 {n:5,x:1258,y:92,w:326,h:898,t:'The text column'}]);
boxes('shot-arch',1600,1000,[
 {n:1,x:20,y:G.arch.prim.y-6,w:284,h:G.arch.capA.y+G.arch.capA.h-G.arch.prim.y+10,t:'Picked'},
 {n:2,x:1276,y:G.arch.rArch.y-8,w:292,h:G.arch.rThird.y+G.arch.rThird.h-G.arch.rArch.y+20,t:'Read back'},
 {n:3,x:G.arch.wheel.x,y:G.arch.wheel.y,w:G.arch.wheel.w,h:G.arch.wheel.h,t:'Rated one to five'},
 {n:3,x:G.arch.scale.x-8,y:G.arch.scale.y-26,w:G.arch.scale.w+16,h:G.arch.scale.h+50},
 {n:4,x:G.arch.cmp.x-8,y:G.arch.cmp.y-4,w:G.arch.cmp.w+16,h:G.arch.cmp.h+8,bad:1}]);
var WC=G.wheelClip, wx=function(x){return x-WC.x;}, wy=function(y){return y-WC.y;};
var wcx=G.arch.wheel.x+G.arch.wheel.w/2, wcy=G.arch.wheel.y+G.arch.wheel.h/2;
boxes('shot-wheel',WC.w,WC.h,[
 {n:1,x:wx(wcx-118),y:wy(wcy-118),w:236,h:236,bad:1},
 {n:2,x:wx(G.arch.wheel.x+150),y:wy(G.arch.wheel.y+8),w:130,h:62,bad:1,dash:1},
 {n:3,x:wx(wcx-30),y:wy(wcy+22),w:60,h:24,bad:1},
 {n:4,x:wx(G.arch.det.x+100),y:wy(G.arch.det.y+180),w:200,h:26,bad:1},
 {n:5,x:wx(G.arch.scale.x-6),y:wy(G.arch.scale.y+76),w:330,h:26,bad:1},
 {n:6,x:wx(G.arch.cmp.x-6),y:wy(G.arch.cmp.y-4),w:G.arch.cmp.w+12,h:G.arch.cmp.h+8,bad:1}]);

/* ---------------- the switch ---------------- */
function show(v){
 document.querySelectorAll('.seg [data-v]').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.v===v);});
 document.querySelectorAll('.view').forEach(function(s){s.classList.toggle('on',s.id==='v-'+v);});}
document.querySelectorAll('.seg [data-v]').forEach(function(b){b.onclick=function(){show(b.dataset.v);history.replaceState(null,'','#'+b.dataset.v);};});
document.querySelectorAll('[data-o]').forEach(function(b){b.onclick=function(){FEED=b.dataset.o;
 document.querySelectorAll('[data-o]').forEach(function(x){x.setAttribute('aria-pressed',x===b);}); drawFeed();};});
document.querySelectorAll('[data-w]').forEach(function(b){b.onclick=function(){
 document.querySelectorAll('[data-w]').forEach(function(x){x.setAttribute('aria-pressed',x===b);});
 el('w-built').hidden=b.dataset.w!=='built'; el('w-prop').hidden=b.dataset.w!=='prop';};});
el('tog').onclick=function(){var on=!document.body.classList.contains('cols');
 document.body.classList.toggle('cols',on); this.setAttribute('aria-pressed',on); this.textContent=on?'Columns shown':'Columns hidden';};
drawCol(); drawFeed(); drawWheel();
/* a hash opens a view directly, which is how the shots are taken:
   #feed-b is the second way, #wheel-prop the proposed wheel */
(function(){var h=location.hash.slice(1).split('-'); if(!h[0])return;
 var b=document.querySelector('.seg [data-v="'+h[0]+'"]'); if(b)show(h[0]);
 if(h[0]==='feed'&&h[1]){var o=document.querySelector('[data-o="'+h[1]+'"]'); if(o)o.click();}
 if(h[0]==='wheel'&&h[1]){var w=document.querySelector('[data-w="'+h[1]+'"]'); if(w)w.click();}})();
</script>
</body></html>`;
fs.writeFileSync(path.join(HERE,'index.html'),html);
console.log('wrote index.html, '+Math.round(html.length/1024)+' KB, from build '+GEO.build);
