/* ============================================================
   THE PAGE, BUILT FROM THE RUN. Round DY.

   Every figure on index.html is read out of sim.json and census.json at build
   time, never typed, because this repository has been bitten a dozen times by
   a number typed into a document that the product then grew past. The
   reactions are written here as data, one set per persona, and they are
   simulated: one model reading six persona records. The page says so first.

     node proto/release-protocol/census.js
     node proto/release-protocol/sim.js
     NODE_PATH=/opt/node22/lib/node_modules WHO=James node proto/release-protocol/shoot.js
     node proto/release-protocol/build.js      writes index.html
   ============================================================ */
const fs=require('fs'),path=require('path');
const D=__dirname;
const SIM=JSON.parse(fs.readFileSync(path.join(D,'sim.json'),'utf8'));
const CEN=JSON.parse(fs.readFileSync(path.join(D,'census.json'),'utf8'));
const facts=w=>JSON.parse(fs.readFileSync(path.join(D,'shots','facts-'+w.toLowerCase()+'.json'),'utf8'));
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const N=SIM.n;

/* the lean of one cell, in words, from the thousand */
const lean=v=>v>=700?'rel':v<=300?'pro':'coin';
const LEANW={rel:'release',pro:'protocol',coin:'coin flip'};
let cells={rel:0,pro:0,coin:0};
SIM.strings.forEach(s=>Object.values(s.by).forEach(v=>cells[lean(v.release)]++));
const total=cells.rel+cells.pro+cells.coin;

/* census figures */
const C=CEN.summary;
const relNeed=C.release_needing_a_rewrite, relAll=C.release;
const protoRows=CEN.rows.filter(r=>/^protocol/i.test(r.word));

/* what each persona's own run said, off the captures */
function run(w){
 const f=facts(w).find(x=>x.variant==='release'&&x.width===1600);
 const d=f.done.split('\n');
 return {top:f.who.top[0],sub:d[2],exp:(f.done.match(/Expression (?:did not move\.|(?:up|down) [\d.]+, now [\d.]+\.)/)||[''])[0]};}

/* ------------------------------------------------------------------
   THE REACTIONS. Simulated. Each line rests on the persona's own record,
   and the record is quoted under it.
   ------------------------------------------------------------------ */
const WHO={
 Sofia:{rel:[
   'Release is my word. I say it to a client with my hand on their sacrum and I mean something physical: the tissue lets go, the breath drops. "Release empties the address" I could read out in a session.',
   '"Nothing released on a worked example." Exact. Say what did not happen.'],
  pro:[
   '"Run the protocol here. Four channels, twenty five lines." That one I like, because it tells me what to run and how long. The steps are written beside the word, so the word is earned.',
   '"The protocol is complete when the body settles" is wrong. A protocol ends when its steps end. The body settling is a release.'],
  split:'Release on the sentences about the body. A coin flip on the two buttons. On the finished card she leans protocol, because "Released" over "0 cleared entirely" is a claim she would not make to a client.'},
 Diane:{rel:[
   '"Two releases at one address." Fine. I know what I am buying.',
   '"Release has about 4.8 points more in it." That is a cost line. That is what I asked for.'],
  pro:[
   '"Run the protocol." I have a morning protocol, a sleep protocol and a supplement protocol, and I am behind on all three. The word says I owe it something before I have opened it.',
   'The one place it wins is the end card. "Protocol complete" is a box ticked. After "Released" sat over "0 cleared entirely, 48 weight freed", I trust the box more.'],
  split:'Release on the cost lines, the tier, the glossary and the refusals. Protocol on the finished card. Everything that hands her an instruction is close, because the obligation in "protocol" costs her about what its order buys.'},
 Marcus:{rel:[
   '"Release empties the address, replace fills it." Two verbs, one mechanism, one line. That is a schematic. Release is a valve word. It has a direction.',
   'Release on its own is a candle shop. It survives here because every time it appears there is an address, a count or a seat attached to it. Keep it that way or I am gone.'],
  pro:[
   '"The protocol has about 0.6 points left to give you." A protocol does not run out. This is the word being used to sound like a clinic. Precision as costume, one noun this time.',
   '"Protocol complete" I can live with, because it claims nothing. "Released" over "0 cleared entirely" is the one release line I would kill.'],
  split:'Release on eleven of twelve. The finished card is the one he does not settle, and it is the same reason as Sofia: the eyebrow claims more than the line under it.'},
 Angela:{rel:[
   'Release is the word every one of my six teachers used. The difference is this one told me where. Fear, lumbar plexus, released. It is the first time the word came with an address.',
   '"Released" is the line I would screenshot.'],
  pro:[
   '"Protocol complete" reads like a discharge form from a hospital.',
   '"First protocol: Fear." I have been put on a treatment plan. The last time software gave me one word about myself, I closed it.'],
  split:'Release on all twelve, in every draw but one of twelve thousand. She is the only one of the six for whom the familiar word is trust. The same familiarity is what the other five hold against it.'},
 Derek:{rel:[
   '"Run a release" is the chalkboard at a yoga studio. It sounds like a mood.',
   'I will give it one thing. "Nothing released on a worked example" is precise.'],
  pro:[
   'Protocol is my word. Training protocol, taper protocol, recovery protocol. It says the set is fixed, and I run fixed sets.',
   '"Run the protocol here. Four channels, twenty five lines." That is an interval session. I would open it tomorrow.'],
  split:'Protocol on all twelve. He is the whole case for it. Read closely, what he wants is the fixed set, and the fixed set is the line beside the button, "Four channels, twenty five lines", which ships under either word.'},
 James:{rel:[
   '"Release this first: Escapism" in large type is a sentence about me I do not want read over my shoulder. Release is not a word I say in a boardroom.',
   '"Nothing released on a worked example" is clean. It states what did not happen.'],
  pro:[
   'I write protocols for other people. Put me on one and I am the patient. "Help implies a deficit." So does this.',
   '"Protocol complete" is a status line and claims nothing about my body. "Released" over "0 cleared entirely, 66 weight freed" is an overstatement, and I find overstatement for a living.'],
  split:'The swing vote, and mostly a coin flip. Release on the definitions and the refusals. Protocol on the finished card. Protocol is discreet on a screen, which he wants, and it puts him on a regimen, which he refuses. Those two cancel.'}};

/* ------------------------------------------------------------------ */
const people=SIM.people;
const tot=p=>{let r=0,pr=0,c=0;SIM.strings.forEach(s=>{const l=lean(s.by[p].release);l==='rel'?r++:l==='pro'?pr++:c++;});return {r,pr,c};};
const third=SIM.third;
/* THE COUNTS IN THE PROSE ARE READ HERE, NOT TYPED. The first draft said four
   of the six pick "Protocol complete"; the table says three outright and two
   leaning. Every count a sentence states comes from one of these. */
const names=a=>a.length===0?'none':a.length===1?a[0]:a.slice(0,-1).join(', ')+' and '+a[a.length-1];
const words=['none','one','two','three','four','five','six'];
const doneBy=SIM.strings.find(s=>s.id==='done').by;
const doneP=people.filter(p=>doneBy[p.nm].release<=300).map(p=>p.nm);
const doneLean=people.filter(p=>doneBy[p.nm].release>300&&doneBy[p.nm].release<500).map(p=>p.nm);
const derekP=tot('Derek').pr;
const rc=k=>({win:people.filter(p=>third.by[p.nm][k]>=700).map(p=>p.nm),
 coin:people.filter(p=>third.by[p.nm][k]>300&&third.by[p.nm][k]<700).map(p=>p.nm),
 lose:people.filter(p=>third.by[p.nm][k]<=300).map(p=>p.nm)});
const rcR=rc('beats_released'), rcP=rc('beats_protocol_complete');

const cell=v=>{const l=lean(v);return `<td class="c ${l}"><span class="n">${v}</span></td>`;};
const grid=`<div class="wrap"><table class="grid">
<tr><th>String</th>${people.map(p=>`<th>${p.nm}</th>`).join('')}</tr>
${SIM.strings.map(s=>`<tr><td><a href="#s-${s.id}">${esc(s.R.length<34?s.R:s.R.slice(0,30)+'...')}</a></td>${people.map(p=>cell(s.by[p.nm].release)).join('')}</tr>`).join('\n')}
<tr class="foot"><td>Strings leaning release, protocol, coin</td>${people.map(p=>{const t=tot(p.nm);return `<td class="num">${t.r} / ${t.pr} / ${t.c}</td>`;}).join('')}</tr>
</table></div>`;

const FEATS=Object.keys(SIM.features);
const strCards=SIM.strings.map((s,i)=>`
<section class="str" id="s-${s.id}">
<div class="str-hd"><span class="bk">${s.bucket}</span><code>${esc(s.where)}</code><span class="ship">ships as ${s.shipped==='R'?'release':s.shipped==='P'?'protocol':'both, in one string'}</span></div>
<div class="pair">
<div class="form rel"><span class="wl">Release</span><p>${esc(s.R)}</p></div>
<div class="form pro"><span class="wl">Protocol</span><p>${esc(s.P)}</p></div>
</div>
<p class="why">${esc(s.why)}</p>
<div class="bars">${people.map(p=>{const v=s.by[p.nm].release;return `<div class="b"><span>${p.nm}</span><i><em class="${lean(v)}" style="width:${(v/N*100).toFixed(1)}%"></em></i><b class="num">${v}</b></div>`;}).join('')}</div>
<details><summary>The scores this rests on</summary><div class="wrap"><table class="sc"><tr><th></th>${FEATS.map(f=>`<th title="${esc(SIM.features[f])}">${f}</th>`).join('')}</tr>
<tr><td>Release</td>${FEATS.map(f=>`<td class="num">${s.xR[f]}</td>`).join('')}</tr>
<tr><td>Protocol</td>${FEATS.map(f=>`<td class="num">${s.xP[f]}</td>`).join('')}</tr></table></div></details>
</section>`).join('');

const img=(f,alt,cap)=>`<figure><a href="shots/${f}"><img src="shots/${f}" alt="${esc(alt)}" loading="lazy"></a><figcaption>${cap}</figcaption></figure>`;

const personaSec=people.map(p=>{
 const r=run(p.nm), t=tot(p.nm), W=WHO[p.nm], lw=p.nm.toLowerCase();
 const srcKeys=Object.keys(p.w).filter(k=>Math.abs(p.w[k])>=1.5);
 return `<section class="who" id="${lw}">
<div class="who-hd"><h2>${p.nm}</h2><span class="role">${p.age}, ${esc(p.role)}. ICP.</span>
<span class="tally"><b class="rel-t">${t.r}</b> release <b class="pro-t">${t.pr}</b> protocol <b>${t.c}</b> coin flip, of ${SIM.strings.length}</span></div>
<p class="says">"${esc(p.says)}"</p>
<p class="run">Their own run, on the real build: heaviest <b>${esc(r.top.k)}</b>, ${esc(r.top.b)}, ${r.top.sq}. The finished card read "${esc(r.sub)}". ${esc(r.exp)}</p>
<div class="shots two-up">
${img(`${lw}-release-390-5-done.jpg`,`${p.nm}, the finished card, release`,'<b>Release.</b> The card a run ends on, phone.')}
${img(`${lw}-protocol-390-5-done.jpg`,`${p.nm}, the finished card, protocol`,'<b>Protocol.</b> The same run, same card.')}
</div>
<div class="react">
<div class="box"><h3>Reading release</h3>${W.rel.map(l=>`<p class="voice">${esc(l)}</p>`).join('')}</div>
<div class="box"><h3>Reading protocol</h3>${W.pro.map(l=>`<p class="voice">${esc(l)}</p>`).join('')}</div>
</div>
<p class="split"><b>The pattern in the thousand.</b> ${esc(W.split)}</p>
<p class="rests"><b>What moves this person most, on file:</b> ${srcKeys.map(k=>`<span><i>${k}</i> ${p.w[k]>0?'draws':'pushes'}: ${esc(p.src[k])}</span>`).join(' ')}</p>
</section>`;}).join('\n');

const surfaces=[['1-summary','Summary, the output row'],['2-address','The address card, heaviest address'],['3-refusal','The address card, nothing held'],['4-pick','The run card, before Begin'],['5-done','The run card, finished']];
const sideBySide=surfaces.map(([k,nm])=>`<div class="sbs"><h3>${nm}</h3><div class="shots two-up">
${img(`james-release-390-${k}.jpg`,`James, ${nm}, release`,'<b>Release</b>, 390')}
${img(`james-protocol-390-${k}.jpg`,`James, ${nm}, protocol`,'<b>Protocol</b>, 390')}
</div></div>`).join('');

const protoMeanings=[
 ['The release run itself','ui/drills.js:268, :273, :445','"Run the protocol here" opens the same run "Run a release" opens on Summary.'],
 ['A breathing or meditation practice','ui/summary.js:620, :622, engine/data/practice.js:39','The Summary card titled "The protocol" names a practice and opens the ritual builder. It sits one card away from "Run a release".'],
 ['The printed card family, his codex\'s name for the procedure','ui/knowledge.js:169, :476, engine/data/cards.js:305, the glossary\'s Letting go and Merkaba','"Release protocol No.01". The glossary: "Letting go. The release protocol. Runs two mechanics in sequence."'],
 ['A different practice altogether','the glossary\'s OJAS','"The protocol developed for Stage 4 and Stage 5 nodes."'],
 ['The whole method','ui/account.js:423, the glossary\'s Reading-as-release and Self-unraveling','"Does the protocol make sense?"']];

const thirdRows=people.map(p=>`<tr><td>${p.nm}</td><td class="num">${third.by[p.nm].beats_released}</td><td class="num">${third.by[p.nm].beats_protocol_complete}</td></tr>`).join('');

const html=`<title>Release or protocol</title>
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<!-- Round DY. Built by build.js from sim.json, census.json and the captures in
     shots/, which shoot.js takes of source.html, read only. Every figure is
     read off the run. The reactions are simulated. -->
<style>
:root{color-scheme:light;
 --bg:#E9E8E3;--panel:#FFFFFF;--panel-2:#F3F3F1;--edge:rgba(20,22,28,.10);--edge-2:rgba(20,22,28,.20);
 --ink:#15171D;--mid:#45433E;--dim:#6B6862;--accent:#2F6E92;--rel:#2F6E92;--rel-bg:rgba(47,110,146,.14);
 --pro:#8A6A10;--pro-bg:rgba(138,106,16,.16);--coin-bg:rgba(20,22,28,.05);--warn:#8A7520;--r:14px;--r-s:10px}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){color-scheme:dark;
 --bg:#0C0D12;--panel:#171A22;--panel-2:#20242E;--edge:rgba(255,255,255,.08);--edge-2:rgba(255,255,255,.15);
 --ink:#EFEDE8;--mid:#B8B4AC;--dim:#8F8B85;--accent:#7EB8D4;--rel:#7EB8D4;--rel-bg:rgba(126,184,212,.16);
 --pro:#DFCC7E;--pro-bg:rgba(223,204,126,.14);--coin-bg:rgba(255,255,255,.04);--warn:#DFCC7E}}
:root[data-theme="dark"]{color-scheme:dark;
 --bg:#0C0D12;--panel:#171A22;--panel-2:#20242E;--edge:rgba(255,255,255,.08);--edge-2:rgba(255,255,255,.15);
 --ink:#EFEDE8;--mid:#B8B4AC;--dim:#8F8B85;--accent:#7EB8D4;--rel:#7EB8D4;--rel-bg:rgba(126,184,212,.16);
 --pro:#DFCC7E;--pro-bg:rgba(223,204,126,.14);--coin-bg:rgba(255,255,255,.04);--warn:#DFCC7E}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.58 Inter,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
main{max-width:1120px;margin:0 auto;padding-inline:16px;padding-block:40px 96px}
h1{font-size:34px;line-height:1.15;margin:0 0 10px;font-weight:650;text-wrap:balance}
h2{font-size:23px;line-height:1.25;margin:64px 0 12px;font-weight:620;text-wrap:balance}
h3{font-size:17px;margin:0 0 8px;font-weight:600}
p,li{max-width:70ch;color:var(--mid)}
p b,li b,td b{color:var(--ink);font-weight:600}
.lede{font-size:18px;color:var(--ink);max-width:64ch}
a{color:var(--accent)}
a:focus-visible,summary:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
code{font-size:13px;color:var(--dim)}
.num{font-variant-numeric:tabular-nums;white-space:nowrap}
.box{background:var(--panel);border:1px solid var(--edge);border-radius:var(--r);padding:18px 20px}
.answer{border:1px solid var(--rel);background:var(--panel);border-radius:var(--r);padding:20px 22px;margin:22px 0}
.answer h2{margin:0 0 10px}
.answer ol{margin:8px 0 0;padding-left:22px;display:grid;gap:8px}
.warn{border-color:var(--warn)}
.cols{display:grid;grid-template-columns:1fr 1fr;gap:18px}
.cols ul{margin:6px 0 0;padding-left:20px}
.wrap{overflow-x:auto}
table{border-collapse:collapse;width:100%;font-size:15px;margin:10px 0}
th,td{text-align:left;vertical-align:top;padding:8px 10px;border-top:1px solid var(--edge)}
th{color:var(--dim);font-weight:500;font-size:13px}
td{color:var(--mid)}
.grid td.c{text-align:center}
.grid td.rel{background:var(--rel-bg)}.grid td.pro{background:var(--pro-bg)}.grid td.coin{background:var(--coin-bg)}
.grid td.rel .n{color:var(--rel);font-weight:600}.grid td.pro .n{color:var(--pro);font-weight:600}
.grid .n{font-variant-numeric:tabular-nums}
.grid tr.foot td{font-size:13px;color:var(--dim)}
.key{display:flex;flex-wrap:wrap;gap:8px 18px;font-size:14px;color:var(--dim);margin:4px 0 0}
.key i{display:inline-block;width:12px;height:12px;border-radius:3px;vertical-align:-1px;margin-right:6px}
.str{background:var(--panel);border:1px solid var(--edge);border-radius:var(--r);padding:16px 18px;margin:14px 0}
.str-hd{display:flex;flex-wrap:wrap;gap:4px 12px;align-items:baseline;margin-bottom:10px}
.bk{font-size:12px;font-weight:600;letter-spacing:.05em;color:var(--ink);border:1px solid var(--edge-2);border-radius:20px;padding:1px 9px}
.ship{font-size:13px;color:var(--dim)}
.pair{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.form{border-radius:var(--r-s);padding:10px 12px;background:var(--panel-2)}
.form p{margin:4px 0 0;color:var(--ink)}
.wl{font-size:12px;font-weight:600;letter-spacing:.05em}
.form.rel .wl{color:var(--rel)}.form.pro .wl{color:var(--pro)}
.why{font-size:15px;margin:10px 0}
.bars{display:grid;grid-template-columns:repeat(3,1fr);gap:4px 18px}
.b{display:grid;grid-template-columns:62px 1fr 40px;align-items:center;gap:8px;font-size:13px;color:var(--dim)}
.b i{display:block;height:8px;border-radius:4px;background:var(--pro-bg);overflow:hidden}
.b em{display:block;height:100%;background:var(--rel)}
.b b{text-align:right;color:var(--mid);font-weight:500}
details{margin-top:10px;font-size:14px}
summary{cursor:pointer;color:var(--dim)}
.sc{font-size:13px}.sc th{font-size:12px}
.who{margin-top:64px;padding-top:24px;border-top:1px solid var(--edge-2)}
.who-hd{display:flex;flex-wrap:wrap;align-items:baseline;gap:6px 14px}
.who-hd h2{margin:0}
.role{color:var(--dim);font-size:15px}
.tally{font-size:14px;color:var(--dim)}.tally b{font-variant-numeric:tabular-nums;margin-left:6px}
.rel-t{color:var(--rel)}.pro-t{color:var(--pro)}
.says{font-style:italic;color:var(--ink);margin:8px 0 4px}
.run{font-size:15px}
.shots{display:grid;gap:10px;margin:14px 0}
.two-up{grid-template-columns:repeat(2,minmax(0,280px))}
figure{margin:0;background:var(--panel);border:1px solid var(--edge);border-radius:var(--r-s);padding:8px}
figure a{display:block}
figure img{width:100%;height:auto;display:block;border-radius:6px;background:#000}
figcaption{font-size:13px;color:var(--dim);margin:6px 2px 0}
figcaption b{color:var(--ink);font-weight:600}
.react{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.voice{color:var(--ink);margin:8px 0}
.voice::before{content:"\\201C"}.voice::after{content:"\\201D"}
.split{margin:14px 0 6px}
.rests{font-size:14px;color:var(--dim)}
.rests span{display:block;margin-top:4px}.rests i{font-style:normal;color:var(--mid);font-weight:600}
.sbs{margin:20px 0}
.q{background:var(--panel);border:1px solid var(--edge);border-radius:var(--r);padding:16px 18px;margin:14px 0}
.q p{margin:6px 0}
.chg td:nth-child(2),.chg td:nth-child(3){color:var(--ink)}
@media (max-width:820px){.cols,.react,.pair{grid-template-columns:1fr}.bars{grid-template-columns:1fr 1fr}}
@media (max-width:520px){h1{font-size:28px}.bars{grid-template-columns:1fr}.two-up{grid-template-columns:1fr 1fr}}
</style>
<main>
<h1>Release or protocol</h1>
<p class="lede">He asked: "simulate the word release or protocol with the ICPs a thousand times, like see what gets them to feel one's more realistic, and then tell me why." Twelve real strings from the shipped build, each in both words, in front of the six ICPs on file, on their own profiles, on the real screens. Each persona's choice on each string was then run a thousand times with the reading of that persona shaken at random, to see which choices hold and which are coin flips.</p>

<div class="answer">
<h2>The answer: release. Protocol does one job, and that job is not this one.</h2>
<ol>
<li><b>It is the only one of the two that is a verb.</b> The build prints "release" in ${relAll} places a person can read, and ${relNeed} of them are a verb, a past tense or already sit in front of "protocol". Those ${relNeed} cannot take the other word without the sentence being rebuilt. "Nothing to release" has no protocol form.</li>
<li><b>His own glossary already says they are two things.</b> "Release. The discharge of stored charge through the nervous system. Physical and observable." And: "Letting go. The release protocol. Runs two mechanics in sequence." Release is what happens in the body. The protocol is the steps that get it there. Making them one word erases the line the codex draws.</li>
<li><b>The house voice asks for physical metaphors only.</b> A spring releases, a valve releases, a clutch releases. A protocol is a document. Neither word trips the voice gate, so this rule is the one that decides it.</li>
<li><b>"Like you need to do this" is the part the panel reacts to.</b> It is the register <code>BRAND.md</code> rules out: "not a coach, it has no opinion about your life." It draws Derek in and pushes Diane, James and Angela out. Across all six, ${cells.rel} of ${total} choices hold for release, ${cells.pro} for protocol, and ${cells.coin} are coin flips. ${derekP} of the ${cells.pro} protocol choices are Derek's.</li>
<li><b>Protocol already means five different things in the build today</b>, including a breathing practice one card away from "Run a release" on Summary. Adding a sixth would not fix that.</li>
</ol>
<p style="margin-bottom:0"><b>Where he is right, and the one real exception.</b> The card a run ends on says "Released" over "0 cleared entirely" on all six runs. That overstates. ${words[doneP.length][0].toUpperCase()+words[doneP.length].slice(1)} of the six pick "Protocol complete" there outright (${names(doneP)}) and ${names(doneLean)} lean that way, for that reason. That card needs a decision of its own, and it is the second question at the foot of this page.</p>
</div>

<div class="box warn">
<h3>Read this first. What "a thousand times" is here, and what it is not.</h3>
<div class="cols">
<div><b>It is</b>
<ul>
<li>Twelve strings, each quoted from the shipped build with its file and line, each in both words. Every protocol form is the best sentence protocol can make, rebuilt where the grammar forces it. None is written to lose.</li>
<li>Each form scored on nine features, from "names a physical event" to "still says exactly what the engine does". Every score is on the page, under each string.</li>
<li>Each persona given a weight per feature, and every weight cites the line in their record it comes from.</li>
<li>Then each of the ${people.length*SIM.strings.length} persona and string pairs run ${N} times, every weight multiplied by a random amount between none and double, every score moved by up to half a point. That is ${(people.length*SIM.strings.length*N).toLocaleString('en-GB')} simulated choices. A choice that holds in 700 or more of the ${N} is a pattern. Between 300 and 700 is called a coin flip.</li>
</ul></div>
<div><b>It is not</b>
<ul>
<li>A thousand people. One model wrote all six voices and all the scores. A thousand copies of one reader agree because they share an author, which is why the thousand was spent on shaking the reading instead of repeating it.</li>
<li>A measure of what a real person feels. It says whether the answer survives being wrong about the details of each persona.</li>
<li>A vote. The six are not weighted by how many people are like them. The next real step is still five people, twenty minutes each, on their own phones.</li>
</ul></div>
</div>
</div>

<h2>The pattern, in one table</h2>
<p>Each cell is how many of ${N} draws that persona picks <b>release</b> on that string. High is release, low is protocol.</p>
${grid}
<div class="key"><span><i style="background:var(--rel-bg);border:1px solid var(--rel)"></i>release holds, 700 or more</span><span><i style="background:var(--pro-bg);border:1px solid var(--pro)"></i>protocol holds, 300 or fewer</span><span><i style="background:var(--coin-bg);border:1px solid var(--edge-2)"></i>coin flip</span></div>
<p><b>What the table says.</b> Angela and Marcus pick release almost everywhere. Derek picks protocol everywhere. Sofia, Diane and James are the swing, and they split by what the string is doing. When the string names what happens in the body, defines the mechanism, refuses, or sells the tier, they pick release. When it names the procedure as a procedure, the button and the finished card, they are close or pick protocol. That is the glossary's own split, found again from the persona side.</p>

<h2>The six, each on their own run</h2>
<p>Each persona was loaded in the real build with their own stories committed, and their three heaviest addresses run through the product's own release, walked to the end. The two captures are the same run with only the words changed.</p>
${personaSec}

<h2>The five screens, both words, side by side</h2>
<p>James, on a phone. The build is untouched; only the words are swapped on the rendered page. In both versions the Summary card the build titles "The protocol", which names a practice, reads "The practice", so neither word is handicapped by a collision the other escapes.</p>
${sideBySide}

<h2>The twelve strings</h2>
<p>Each string quoted as it ships, with where it ships. The bars are the thousand draws per persona: the blue share is release.</p>
${strCards}

<h2>Measured, and not a matter of taste</h2>
<h3>Where the two words stand in the build today</h3>
<p>Every string literal a person can read, in <code>ui/</code> and in the data tables the renderers print, with comments stripped first. ${C.occurrences} occurrences: release ${C.release}, protocol ${C.protocol}.</p>
<div class="wrap"><table>
<tr><th>Release, by the job it does</th><th class="num">Count</th><th>Can protocol stand there</th></tr>
${Object.entries(C.tally).filter(([k])=>k.startsWith('release')).map(([k,v])=>`<tr><td>${esc(k.replace('release | ',''))}</td><td class="num">${v}</td><td>${k.includes('noun, the event')?'Grammatically, yes. The meaning moves from what the body does to the steps.':'No. The sentence has to be rebuilt.'}</td></tr>`).join('')}
</table></div>
<h3>What "protocol" already means, in its ${protoRows.length} places</h3>
<div class="wrap"><table>
<tr><th>Meaning</th><th>Where</th><th>As it reads</th></tr>
${protoMeanings.map(r=>`<tr><td><b>${esc(r[0])}</b></td><td><code>${esc(r[1])}</code></td><td>${esc(r[2])}</td></tr>`).join('')}
</table></div>
<h3>The finished card, on all six runs</h3>
<p>"Released" sat over "0 cleared entirely" on every one of the six. The run discharged weight at each address, and the card's own second line says none of them emptied. The eyebrow claims the event; the line under it reports the arithmetic. A third form was run against both on the same ${N} draws: "Run complete", which already ships as the Games surface's finished eyebrow at <code>ui/games.js:184</code>, on the same verb as every release button.</p>
<div class="wrap"><table>
<tr><th>Draws of ${N} in which "Run complete" wins</th><th>against "Released"</th><th>against "Protocol complete"</th></tr>
${thirdRows}
</table></div>
<p>Against "Released" it holds for ${names(rcR.win)}, is a coin flip for ${names(rcR.coin)}, and loses ${names(rcR.lose)}. Against "Protocol complete" it holds for ${names(rcP.win)}, is a coin flip for ${names(rcP.coin)}, and loses ${names(rcP.lose)}. It is not a clean winner, which is why it is a question below and not a ruling.</p>

<h2>What changes, if he rules release</h2>
<p>Old and new, side by side. Everything else already says release.</p>
<div class="wrap"><table class="chg">
<tr><th>Where</th><th>Ships</th><th>Becomes</th><th>Why</th></tr>
<tr><td><code>ui/drills.js:268, :445</code></td><td>Run the protocol here</td><td>Run a release here</td><td>The same button as "Run a release" on Summary. One control, one word. "Four channels, twenty five lines." stays beside it; it is what Derek actually wants.</td></tr>
<tr><td><code>ui/drills.js:273</code></td><td>The protocol opens once this address is carrying.</td><td>A release opens once this address is carrying.</td><td>The refusal today changes word halfway through.</td></tr>
<tr><td><code>ui/summary.js:620, :622</code></td><td>The protocol</td><td>The practice</td><td>It names a breathing or meditation practice and opens the ritual builder. It was never a release.</td></tr>
<tr><td><code>engine/data/practice.js:39</code></td><td>Run it from your protocol any time the felt reference drifts.</td><td>Run it from your ritual any time the felt reference drifts.</td><td>"Your protocol" here is the ritual.</td></tr>
<tr><td><code>ui/account.js:423</code></td><td>Does the protocol make sense?</td><td>Does the release work make sense?</td><td>"Release work" is the glossary's own phrase for the method.</td></tr>
<tr><td><code>ui/release.js:305</code></td><td>Released</td><td>His call, question 2</td><td>Overstates on all six runs.</td></tr>
<tr><td><code>ui/knowledge.js:476</code>, the card family</td><td>Release protocol No.01</td><td>His call, question 3</td><td>The codex's own title for the printed cards.</td></tr>
</table></div>
<p>And one rule that keeps release off the shelf, which Marcus, Derek and James all raise: <b>release never stands alone.</b> Every time it appears there is an address, a count or a seat attached. Every shipped string on the five screens above already does this.</p>

<h2>What I need from him</h2>
<div class="q"><p><b>1. Release as the one word for the mechanic, everywhere a person presses, reads or is refused?</b></p>
<p>Release: five strings change, listed above, and nothing else moves. Protocol: ${relAll} places change and ${relNeed} of them need the sentence rebuilt, the glossary's Release entry has to change what it defines, and Derek gains the word he trains with while Diane, James and Angela each lose some ground.</p></div>
<div class="q"><p><b>2. The card a run ends on. It says "Released" above "0 cleared entirely".</b></p>
<p>Keep "Released": Angela screenshots it, and ${names(doneP.concat(doneLean))} read it as more than the run did. "Run complete": true, and no new word, since it already ships in Games; Angela loses the moment. "Protocol complete": true, and Derek and Sofia prefer it, but it brings protocol back as a second word for the same run.</p>
<div class="shots two-up">${img('james-release-390-5-done.jpg','James, finished card, Released','<b>As it ships.</b> James, phone.')}${img('james-protocol-390-5-done.jpg','James, finished card, Protocol complete','<b>Protocol complete.</b> Same run.')}</div></div>
<div class="q"><p><b>3. The printed cards in Knowledge are titled "Release protocol No.01". Keep the codex's own title, or rename them "Release card No.01" so protocol leaves the product entirely?</b></p>
<p>Keep: the one place protocol names exactly what it means, a fixed written procedure, and it matches the codex. Rename: one word per concept with no exception, and the codex and the product then differ, which is <code>BOOK-ERRATA.md</code> territory.</p></div>
<div class="q"><p><b>4. Derek is the one person protocol wins. Should the Summary button carry the length beside it, the way the address card already does, so the fixed set he trains on is visible without the word?</b></p>
<p>Yes: one line under "Run a release", read off the plan, for example "Twelve lines, about thirty seconds". No: Summary stays as it is, and he finds the set on the address card and the run card, where it already prints.</p></div>

<h2>How this was made</h2>
<p><code>census.js</code> reads every user visible string in <code>atuned_src</code> and tags each occurrence of either word by its grammatical job; its first cut read "Release the fear." as a noun, and was corrected after reading every row by eye. <code>shoot.js</code> opens <code>source.html</code> read only, loads each ICP from <code>engine/data/people.js</code>, commits their own lines from <code>sim/stories.js</code>, swaps the words on the rendered page for the protocol version, and drives the product's own entry points: Summary, the address card, the refusal, the run card, and a real run walked to its end with the worked example refusal lifted inside <code>relCoolDown</code> only. <code>sim.js</code> is seeded, so the thousand are the same thousand on every run. The ages, roles and needs quoted are from <code>people.js</code> and <code>RESEARCH-icp.md</code>. The reactions are simulated.</p>
<p><code>node proto/release-protocol/census.js</code><br><code>NODE_PATH=/opt/node22/lib/node_modules WHO=James node proto/release-protocol/shoot.js</code><br><code>node proto/release-protocol/sim.js</code><br><code>node proto/release-protocol/build.js</code></p>
</main>`;
fs.writeFileSync(path.join(D,'index.html'),html);
/* the images the page actually uses, for a publish that carries only those */
const used=[...new Set((html.match(/shots\/[\w.-]+\.jpg/g)||[]))];
fs.writeFileSync(path.join(D,'used.json'),JSON.stringify(used,null,1));
console.log('wrote index.html,',html.length,'bytes,',used.length,'images referenced');
