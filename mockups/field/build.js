/* build.js. Writes the two point cloud mockups as standalone pages, each one
   file with nothing fetched, so either opens on its own wherever it is
   saved. Same posture as proto/compass-redesign/build.js: the typeface is
   the product's own embedded Inter, lifted out of atuned_src/shell/head.html
   (read, never written), and any dash that is not a hyphen fails the build.

   Run from the repo root: node mockups/field/build.js */
const fs=require('fs'),path=require('path');
const D=__dirname,rd=f=>fs.readFileSync(path.join(D,f),'utf8');
const head=fs.readFileSync(path.join(D,'../../atuned_src/shell/head.html'),'utf8');
const fm=/@font-face\{[^}]*\}/.exec(head);
if(!fm)throw new Error('no @font-face in head.html');
const css=rd('src/page.css'),core=rd('src/core.js');
const PAGES=[
 {file:'concept-1.html',src:'src/c1.js',title:'Point cloud, ink',ey:'Point cloud, concept 1 of 2',h1:'Ink',
  p:'Where the fallen matter crowds, the points give way to one body of dark liquid that fuses, necks and drips. Four isolines trace the volume it occupies, like a pressure map of the fall.',
  prev:'concept-2.html',next:'concept-2.html'},
 {file:'concept-2.html',src:'src/c2.js',title:'Point cloud, branch',ey:'Point cloud, concept 2 of 2',h1:'Branch',
  p:'Where the fallen matter crowds, it grows a branching skeleton through its own points, finer the thicker it is, and the ball of light gets a fractal coastline. Each falling pattern is traced as its own hull, with the line it fell along.',
  prev:'concept-1.html',next:'concept-1.html'}];
PAGES.forEach(P=>{
 const h='<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
  +'<title>'+P.title+'</title><style>'+fm[0]+'\n'+css+'</style></head><body>'
  +'<div class="app"><header class="hd"><div><div class="ey">'+P.ey+'</div><h1>'+P.h1+'</h1><p>'+P.p+'</p>'
  +'<div class="mock">Mockup on toy numbers, built on the Registers view of the Compass. Nothing here reads a profile.</div></div>'
  +'<nav class="nav" aria-label="Concepts"><a href="index.html">Both concepts</a><a href="'+P.next+'">Other concept</a></nav></header>'
  +'<main class="stage" id="stage" aria-label="Point cloud"><div class="cap" id="cap"></div></main>'
  +'<aside class="rail" id="rail"></aside></div>'
  +'<script>\n'+core+'\n'+rd(P.src)+'\n</script></body></html>\n';
 if(/[—–]/.test(h))throw new Error(P.file+' carries a dash that is not a hyphen');
 if(/\b108\b/.test(h.replace(/@font-face\{[^}]*\}/,'')))throw new Error(P.file+' says 108');
 fs.writeFileSync(path.join(D,P.file),h);console.log(P.file,(h.length/1024).toFixed(0)+' KB');});
