/* Builds the body map prototype into one file with no dependencies.
   node proto/body-map-build/src/build.js
   Reads data.json (from data.js) and, when it exists, sim.json (from sim.js),
   and writes proto/body-map-build/body-map.html. Pack it after with
   node tools/pack.js proto/body-map-build/body-map.html proto/body-map-build/packed/body-map.html */
var fs=require('fs'),path=require('path');
var here=__dirname,out=path.join(here,'..');
var rd=function(f){return fs.readFileSync(path.join(here,f),'utf8');};
var data=rd('data.json'), app=rd('app.js'), tpl=rd('template.html');
var sim=fs.existsSync(path.join(here,'sim.json'))?JSON.parse(rd('sim.json')):null;
function tr(a,cls){return '<tr'+(cls?' class="'+cls+'"':'')+'>'+a.map(function(x,i){return '<td'+(typeof x==='number'?' class="n"':'')+'>'+x+'</td>';}).join('')+'</tr>';}
function th(a){return '<tr>'+a.map(function(x){return '<th>'+x+'</th>';}).join('')+'</tr>';}

var SW='<p>Pressing Pain dulls the nerve and seat map and raises the heat. Each switch does it one way. Change the switch above and it replays. A, B and C were built to his words. D was built afterwards, from what the simulation found in the first three, and measured the same way.</p>'
 +'<table>'+th(['Switch','What dims','How the heat arrives','Timing'])
 +tr(['A · Fade','Nerves to 30 percent and nearly grey, seats to 30, evenly, everywhere','Rises with the ground, smooth, to 86 percent','Both 400ms together, ease in and out'])
 +tr(['B · Reveal','Nerves to 20 percent where there is no pain. Under the pain they stay lit and warm. Seats hold at 50','Colour arrives ahead of strength, to 74 percent','Ground 260ms, then heat 520ms starting at 140ms, ease out'])
 +tr(['C · Isotherm','Nerves to 55 percent, seats to 60, evenly','Five bands, one at a time from cool to hot, each edge drawn as a thin light line','Ground 300ms, bands every 90ms'])
 +tr(['D · Bands and reveal','Nerves to 42 percent where there is no pain. Under the pain they stay lit at six tenths. Seats hold at 55','C\'s five bands','Ground 260ms, bands every 80ms from 100ms'])
 +'</table>';
var SIM='';
if(sim){
 SIM=SW+'<h4 style="color:var(--ink);margin:16px 0 4px">Measured, on the calibration ladder</h4>'
  +'<p>Five cells painted at 2, 4, 6, 8 and 10 on the front torso, where the nerves are densest. Read in headless Chromium at '+sim.w+' by '+sim.h+', the heat fully up, from the pixels on screen. '+sim.when+'.</p>'
  +'<table>'+th(['','A · Fade','B · Reveal','C · Isotherm','D · Bands and reveal','What it means'])
  +['minStepDE','clutterSdL','nerveInHeat','nerveOutHeat','heat90','settled','frame'].map(function(k){var m=sim.metricsInfo[k];
    return tr([m.nm].concat(['A','B','C','D'].map(function(v){var x=sim.v[v][k];return x==null?'n/a':typeof x==='number'?+x.toFixed(m.dp):x;})).concat([m.why]));}).join('')
  +'</table>'
  +'<h4 style="color:var(--ink);margin:16px 0 4px">The panel, simulated</h4>'
  +'<p>The six ICPs from the roster, each weighted on the four things the numbers above measure, by what their own recorded words say they come for. This is the team modelling the panel, not the panel. The weights are shown so they can be argued with.</p>'
  +'<table>'+th(['Who','Weight of 1,000','Reads the level','Sees the route','Stays oriented','Speed','A','B','C','D','Picks'])
  +sim.panel.map(function(p){return tr([p.nm+', '+p.age+'. '+p.role,p.pw,p.w.level,p.w.route,p.w.orient,p.w.speed,+p.s.A.toFixed(2),+p.s.B.toFixed(2),+p.s.C.toFixed(2),+p.s.D.toFixed(2),p.pick]);}).join('')
  +tr(['Weighted by the panel','','','','','',+sim.total.A.toFixed(3),+sim.total.B.toFixed(3),+sim.total.C.toFixed(3),+sim.total.D.toFixed(3),sim.total.pick],'win')
  +'</table><p>'+sim.verdict+'</p>'
  +'<p><b style="color:var(--ink)">The art direction call: C, and it opens on C.</b> It wins on the panel\'s weights and on equal weights, and loses only where seeing the route counts for half or more. The one thing it gives up, which nerve sits under the pain, is already drawn in every switch by the pain line, which rides that nerve from the painted place to the spine. B shows the same thing a second time and pays for it in how well the level reads. D, built to split the difference, split it and won nothing, and it stays here because a measured loss is worth seeing.</p>';
}else SIM=SW+'<p>The simulation has not been run on this build.</p>';

var TIMING='<table>'+th(['What','How long','Curve','Note'])
 +tr(['Pattern to Pain','per switch, above','per switch','Pain to Pattern is the same for all three: heat out in 220ms, then ground back in 320ms'])
 +tr(['Saboteur pulse','a route in 5 to 14 s','linear','speed by the square root of tension. Toward the heaviest address while loading, away while releasing'])
 +tr(['Saboteur hum','0.9 to 3.1 a second','sine, a standing wave pinned at each address','amplitude by tension to the power 1.5. Three times on trace'])
 +tr(['Sag','none','','slack by (1 minus tension over 10) to the power 1.3. A taut cable runs straight'])
 +tr(['Trace, on pointing at a line','700ms, then hold and hum','ease out cubic','his CU ruling: traces the whole line, holds, hums by its tension'])
 +tr(['Mark kicked by a pulse','about 500ms, 20 percent over','spring, w 14, damping .42','the Field\'s own ring spring, from d-fringe'])
 +tr(['Stress fringes','born at the mark, 4 deep','travel with the load','spacing 9 to 4px by strain, past five only'])
 +tr(['Load drift','15 to 26s a cycle','sine','sets loading or releasing, per saboteur'])
 +tr(['Pain line pulse','toward the spine','linear','the direction a pain signal travels. Faster when painted higher'])
 +tr(['Opening a region','about 400ms','exponential chase','double press, or the button on the region card'])
 +'</table><p>Under reduced motion every switch lands at its end state with no curve, nothing pulses, hums or drifts, and the canvas repaints only when something changes.</p>';

var d=JSON.parse(data);
var PROV='<table>'+th(['What','Where it comes from'])
 +tr(['The man, nerves, seats','the front and back figure he locked on 27 September, FW option A, taken apart into layers so each can dim alone'])
 +tr(['Where each address stands','proto/body-map-spec/gen.js, which reads ANAT from the engine and FW\'s proposed places. '+d.places.length+' drawn points, every one of the 112 inside the body, which is all but the 4 field anchors above and below it'])
 +tr(['Which surface is nearer','the spec\'s own split: 17 addresses belong on the back. With question C at C3 they show on both, faint on the far one'])
 +tr(['The 48 regions','the first taxonomy in merge.js, question M. Palm, hip, knee, shin, ankle and foot on the front, and the back\'s own'])
 +tr(['The grid','5 cm cells, '+'20 by 36 laid over each view'])
 +tr(['Fetter marks','CHILD in canon.js, the nine fetters\' own marks. Shape says which fetter, colour says which seat it stands in'])
 +tr(['Saboteur lines','SAB_LIB, each saboteur\'s three addresses. Colour is its family\'s seat, from HCX_LIB'])
 +tr(['Limb centres','his list, "palm, feet, shin, knee". Nothing in the engine stands there yet. Proposed, question D'])
 +tr(['Charges, tensions, pain','mock. Each address takes its fetter\'s charge from a roster person, moved a little per address. Pain is a preset per person. None of it is a reading'])
 +tr(['Tension line routes','each region to the spine along a nerve drawn in the figure, entering at a level read off the back figure\'s own labels'])
 +'</table>';

var html=tpl.split('{{STAMP}}').join(new Date().toISOString().slice(0,10))
 .split('{{SIM}}').join(SIM).split('{{TIMING}}').join(TIMING).split('{{PROV}}').join(PROV)
 .split('{{DATA}}').join(data).split('{{APP}}').join(app);
if(/\u2014/.test(html))throw new Error('body-map.html carries an em dash');
if(/\b108\b/.test(html.replace(/window\.__DATA=[\s\S]*?;<\/script>/,'')))console.warn('  note: the number 108 appears outside the data');
fs.writeFileSync(path.join(out,'body-map.html'),html);
console.log('  body-map.html  '+html.length.toLocaleString()+' bytes'+(sim?'  with the simulation':''));
