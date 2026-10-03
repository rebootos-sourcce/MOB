/* Builds the four Field mockups from one shared half and four variant files.
   node proto/field/tension/src/build.js
   Writes a-strain.html, b-wire.html, c-heat.html, d-fringe.html one level up. */
var fs=require('fs'), path=require('path');
var here=__dirname, out=path.join(here,'..');
var tpl=fs.readFileSync(path.join(here,'template.html'),'utf8');
var common=fs.readFileSync(path.join(here,'common.js'),'utf8');
function row(a){return '<tr>'+a.map(function(x){return '<td>'+x+'</td>';}).join('')+'</tr>';}
var SHARED=[
 ['Load up, per seat','380ms, 62ms apart, Root first','ease out cubic','as shipped'],
 ['Tension arriving at five','about 320ms, 8 percent over','spring, w 20, damping .62','dips the wrong way first'],
 ['Pointer lens following','about 160ms to settle','critically damped spring, w 30',''],
 ['Names arriving / leaving','140ms / 260ms','exponential chase','word mode only'],
 ['Lens appearing with zoom','2.05 to 2.67','smoothstep','the shipped names ramp'],
 ['Zoom, one notch','x1.12, about 130ms','exponential chase','toward the pointer'],
 ['Go to an address','480ms','ease out cubic',''],
 ['Breath, at rest','4.2s a cycle, a tenth of a unit','sine, travelling round the ring','off under reduced motion'],
 ['Load drift','15 to 26s a cycle','sine','sets expanding or collapsing']];
var V={
 A:{file:'a-strain.html',src:'a.js',name:'Strain marks',
  sub:'Tension drawn the way an animator draws strain. Short marks come off every address past five. Rising load, they run outward and point away. Falling load, they run inward and point at it. They step at twelve frames a second while the rest runs at sixty, so the hot ones stand out. Zoom in and names appear around the pointer, dissolving at the edge.',
  rows:[['Strain marks','12 a second, on twos','stepped','3 to 5 marks, length by tension'],
        ['Squash and stretch','with tension','spring','area held'],
        ['Lens','160px, full to 45 percent','smoothstep, per pixel','']]},
 B:{file:'b-wire.html',src:'b.js',name:'Taut wire',
  sub:'Every address past five is held to the core by a wire under load. The soft band either side is the wire buzzing, and it buzzes faster the harder it is pulled. Rising load pushes the address out and runs pulses outward. Falling load pulls it in and runs them home. Zoom in and a wide loupe names everything under the pointer, with its value.',
  rows:[['Wire buzz','6 to 14 a second','square root of tension','none under reduced motion'],
        ['Envelope shimmer','1.7 a second','sine',''],
        ['Pulses','20 to 80px a second','square root of tension','direction is the load'],
        ['Lens','220px, no flat top','gaussian, per word','names grow up to 12 percent']]},
 C:{file:'c-heat.html',src:'c.js',name:'Heat',
  sub:'Running hot, literally. An address past five shifts toward white as it strains and takes the red edge at nine. Rising load, rings leave it and open outward. Falling load, rings close in onto it. A run of hot neighbours gets one pressure line round the outside. Zoom in and everything outside the pointer dims, except the heat.',
  rows:[['Rings','1.5s cool to 0.6s hot','sine envelope','reverse at the turn'],
        ['Heat shimmer','2.2 a second, one pixel','sine','off under reduced motion'],
        ['Lens','170px, full to 40 percent','cosine, per pixel','field outside dims 60 percent']]},
 D:{file:'d-fringe.html',src:'d.js',name:'Fringes, and which names win',
  sub:'The ring bends under load. Rising load bulges it out, falling load dents it in, and the bend spreads to the neighbours and settles with a little overshoot. Stress bands form outside, tighter where the strain is worst. Names can appear for two reasons, charge as today or the pointer as asked. The buttons under the Field switch between four ways they could share the ring.',
  rows:[['Ring bend','about 500ms, 20 percent over','spring, w 14, damping .42','spread over about 5 addresses'],
        ['Stress bands','born at the ring, 5 deep','travel with the load','spacing 10 to 4px'],
        ['Lens','190px, full to 35 percent','smoothstep, per word','']]}};
Object.keys(V).forEach(function(id){var v=V[id];
 var table='<table><tr><th>What</th><th>How long</th><th>Curve</th><th>Note</th></tr>'
  +v.rows.concat(SHARED).map(row).join('')+'</table>'
  +'<p>Frame cost is main thread canvas, not compositor. Under reduced motion loads sit at their end values, nothing drifts or buzzes, tension is drawn still, and the canvas repaints only when you move or zoom.</p>';
 var html=tpl.split('{{ID}}').join(id).split('{{NAME}}').join(v.name).split('{{SUB}}').join(v.sub)
  .split('{{TABLE}}').join(table)
  .split('{{CUR_A}}').join(id==='A'?' aria-current="page"':'')
  .split('{{CUR_B}}').join(id==='B'?' aria-current="page"':'')
  .split('{{CUR_C}}').join(id==='C'?' aria-current="page"':'')
  .split('{{CUR_D}}').join(id==='D'?' aria-current="page"':'')
  .split('{{VARIANT_JS}}').join(fs.readFileSync(path.join(here,v.src),'utf8'))
  .split('{{COMMON_JS}}').join(common);
 if(/\u2014/.test(html))throw new Error(v.file+' carries an em dash');
 fs.writeFileSync(path.join(out,v.file),html);
 console.log('  '+v.file+'  '+html.length.toLocaleString()+' bytes');});
