/* Joins the shared parts and one version into a single self-contained page.
   Run from the repo root:  node mockups/character-torus/src/build.js
   The 112 addresses are read, never written, out of atuned_src/engine/data/nodes.js and carried into each page as a small table, so the page
   still has no dependencies and no network. Nothing here touches atuned_src/ or source.html. */
const fs=require('fs'),path=require('path');
const dir=__dirname,out=path.join(dir,'..'),root=path.join(dir,'..','..','..');
const rd=f=>fs.readFileSync(path.join(dir,f),'utf8');
const nodesSrc=fs.readFileSync(path.join(root,'atuned_src','engine','data','nodes.js'),'utf8');
const NODES=new Function(nodesSrc+';return NODES;')();
if(NODES.length!==112)throw new Error('expected 112 addresses, found '+NODES.length);
const nodes112='const NODES112='+JSON.stringify(NODES.map(n=>[n.i,n.k,n.b,n.n,n.c]))+';';
const SYSTEMS=[
 {id:'torus-1',name:'Torus 1, Flow',file:'sys-t1.js',sym:'SYS_T1'},
 {id:'torus-2',name:'Torus 2, Slices',file:'sys-t2.js',sym:'SYS_T2'},
 {id:'torus-3',name:'Torus 3, Shell',file:'sys-t3.js',sym:'SYS_T3'}];
const css=rd('shared.css');
const shared=['core.js','spectrum.js','scene.js','body.js','world.js','glyphs.js'].map(rd).join('\n')+'\n'+nodes112+'\n'+['air.js','addr.js','bodypass.js','torus3d.js','torusinit.js'].map(rd).join('\n');
const page=rd('page.js'),sheet=rd('sheet.js');
SYSTEMS.forEach(s=>{
 const sys=rd(s.file);
 const head='<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">\n';
 const mk=(title,tail,body)=>head+'<title>'+title+'</title>\n<style>'+css+'</style></head><body>\n<div class="app" id="app"></div>\n<script>\n'+shared+'\n'+sys+'\n'+body+'\n'+tail+'\n</script></body></html>\n';
 const html=mk('Character, '+s.name,'boot('+s.sym+');',page);
 const sh=mk(s.name+', load and coherence','bootSheet('+s.sym+');',page+'\n'+sheet);
 [html,sh].forEach(x=>{if(x.indexOf(String.fromCharCode(8212))>=0)throw new Error('em dash in '+s.id);});
 fs.writeFileSync(path.join(out,s.id+'.html'),html);
 fs.writeFileSync(path.join(out,'states-'+s.id+'.html'),sh);
 console.log('wrote',s.id+'.html',Math.round(html.length/1024)+' KB','and states-'+s.id+'.html');});
