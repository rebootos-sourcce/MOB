/* Assembles the three prototypes into standalone HTML. Everything is inlined:
   no stylesheet, no script, no font and no network request of any kind, which
   is the same constraint source.html itself is held to. */
const fs=require('fs'), path=require('path'), D=__dirname;
const R=f=>fs.readFileSync(path.join(D,f),'utf8');
const data=R('data.json'), css=R('_shell.css'), js=R('_common.js');
const PAGES={
 'compass.html':['_A.html','Ritual, design A, the compass'],
 'board.html':['_B.html','Ritual, design B, the board'],
 'tape.html':['_C.html','Ritual, design C, the tape']};
Object.entries(PAGES).forEach(([out,[src,title]])=>{
 const body=R(src);
 const h='<!doctype html><html lang="en"><head><meta charset="utf-8">'
 +'<meta name="viewport" content="width=device-width,initial-scale=1">'
 +'<title>'+title+'</title><style>\n'+css+'\n</style></head><body>\n'
 +body.replace(/<script>/,'<script>\n'+js+'\nvar DATA='+data+';\n')
 +'\n</body></html>';
 fs.writeFileSync(path.join(D,out),h);
 console.log(out.padEnd(14)+(h.length/1024).toFixed(1)+' kB');
 if(/https?:\/\/(?!localhost)/.test(h.replace(/https?:\/\/[^"'\s]*/g,m=>m))&&/src=["']http|href=["']http/.test(h))
  throw new Error('network reference in '+out);});
