/* Joins the shared parts and one version into a single self-contained page.
   Run from the repo root:  node mockups/character-aura/src/build.js
   The page and its state sheet are built from the same parts, so what the sheet shows is what the page does.
   Nothing here touches atuned_src/ or source.html. */
const fs=require('fs'),path=require('path');
const dir=__dirname,out=path.join(dir,'..');
const rd=f=>fs.readFileSync(path.join(dir,f),'utf8');
const SYSTEMS=[
 {id:'aura-1',name:'Aura 1, Prism',file:'sys-1.js',sym:'SYS_1'},
 {id:'aura-2',name:'Aura 2, Corona',file:'sys-2.js',sym:'SYS_2'},
 {id:'aura-3',name:'Aura 3, Orbit',file:'sys-3.js',sym:'SYS_3'}];
const css=rd('shared.css');
const shared=['core.js','spectrum.js','scene.js','body.js','world.js','glyphs.js'].map(rd).join('\n');
const page=rd('page.js'),sheet=rd('sheet.js');
SYSTEMS.forEach(s=>{
 const sys=rd(s.file);
 const head='<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">\n';
 const mk=(title,tail,body)=>head+'<title>'+title+'</title>\n<style>'+css+'</style></head><body>\n<div class="app" id="app"></div>\n<script>\n'+shared+'\n'+sys+'\n'+body+'\n'+tail+'\n</script></body></html>\n';
 /* the variants nav lives in page.js and is reused by the sheet */
 const html=mk('Character, '+s.name,'boot('+s.sym+');',page);
 const sh=mk(s.name+', two axes','bootSheet('+s.sym+');',page+'\n'+sheet);
 [html,sh].forEach(x=>{if(x.indexOf(String.fromCharCode(8212))>=0)throw new Error('em dash in '+s.id);});
 fs.writeFileSync(path.join(out,s.id+'.html'),html);
 fs.writeFileSync(path.join(out,'states-'+s.id+'.html'),sh);
 console.log('wrote',s.id+'.html',Math.round(html.length/1024)+' KB','and states-'+s.id+'.html');});
