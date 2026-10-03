/* Joins the shared parts and one system into a single self-contained page.
   Run from the repo root:  node mockups/character-cloud/src/build.js */
const fs=require('fs'),path=require('path');
const dir=__dirname,out=path.join(dir,'..');
const rd=f=>fs.readFileSync(path.join(dir,f),'utf8');
const SYSTEMS=[
 {id:'a-aura',name:'Aura',file:'sys-a.js',sym:'SYS_A'},
 {id:'b-contour',name:'Contour',file:'sys-b.js',sym:'SYS_B'},
 {id:'c-mosaic',name:'Mosaic',file:'sys-c.js',sym:'SYS_C'}];
const css=rd('shared.css'),core=rd('core.js'),scene=rd('scene.js'),page=rd('page.js'),sheet=rd('sheet.js');
SYSTEMS.forEach(s=>{
 if(!fs.existsSync(path.join(dir,s.file)))return;
 const sys=rd(s.file);
 const html='<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">\n'
  +'<title>Character, '+s.name+'</title>\n<style>'+css+'</style></head><body>\n<div class="app" id="app"></div>\n<script>\n'
  +'const SYSTEMS='+JSON.stringify(SYSTEMS.map(x=>({id:x.id,name:x.name})))+';\n'+core+'\n'+scene+'\n'+sys+'\n'+page+'\nboot('+s.sym+');\n</script></body></html>\n';
 if(html.indexOf(String.fromCharCode(8212))>=0)throw new Error('em dash in '+s.id);
 fs.writeFileSync(path.join(out,s.id+'.html'),html);
 console.log('wrote',s.id+'.html',Math.round(html.length/1024)+' KB');
 const sh=html.replace(page,()=>sheet).replace('boot('+s.sym+');',()=>'bootSheet('+s.sym+');').replace('<title>Character, '+s.name+'</title>',()=>'<title>Character, '+s.name+', three loads</title>');
 fs.writeFileSync(path.join(out,'states-'+s.id+'.html'),sh);});
