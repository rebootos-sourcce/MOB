/* build.js. Writes five standalone pages from src/ and data.js, each one
   file with nothing fetched, so any one of them opens on its own wherever
   it is saved. HT in TASKS.md: a prototype that needs a sibling file to work
   is one he cannot click open.

   Run from the repo root: node proto/compass-redesign/build.js
   The typeface is the product's own embedded Inter, lifted out of
   atuned_src/shell/head.html, so the type on these pages is the type in the
   product and not whatever the machine falls back to. */
const fs=require('fs'),path=require('path');
const D=__dirname,rd=f=>fs.readFileSync(path.join(D,f),'utf8');
const head=fs.readFileSync(path.join(D,'../../atuned_src/shell/head.html'),'utf8');
const fm=/@font-face\{[^}]*\}/.exec(head);
if(!fm)throw new Error('no @font-face in head.html');
const FILES={a:'a-laws.html',b:'b-mirror.html',c:'c-shell.html',d:'d-rings.html',board:'index.html'};
const TITLES={a:'Compass, twenty one laws',b:'Compass, mirror axes',c:'Compass, seats under load',d:'Compass, growth rings',board:'Compass, four options'};
const css=rd('src/page.css'),kit=rd('src/kit.js'),data=rd('data.js');
function nav(on){return '<nav>'+['board','a','b','c','d'].map(k=>'<a href="'+FILES[k]+'"'+(k===on?' class="on" aria-current="page"':'')+'>'
 +(k==='board'?'All four':'Option '+k.toUpperCase())+'</a>').join('')+'</nav>';}
function page(k){
 const board=k==='board';
 const body=board
  ?'<div class="app"><aside class="tools" id="tools"></aside><main class="stagecol"><div class="hdr"><h1>The compass as a circle, four options</h1>'+nav(k)+'</div>'
   +'<div class="grid" id="grid"></div><div class="hov" id="hov"></div></main><aside class="info" id="info"></aside></div>'
  :'<div class="app"><aside class="tools" id="tools"></aside><main class="stagecol"><div class="hdr"><span class="let">'+k.toUpperCase()+'</span><h1 id="ttl"></h1>'+nav(k)+'</div>'
   +'<div class="stage"><canvas id="cv" role="img"></canvas></div><div class="under"><div class="hov" id="hov"></div><div class="key" id="key"></div></div></main>'
   +'<aside class="info" id="info"></aside></div>';
 return '<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
  +'<title>'+TITLES[k]+'</title><style>'+fm[0]+'\n'+css+'</style></head><body>'+body
  +'<script>\n'+data+'\n'+kit+'\nvar FILES='+JSON.stringify(FILES)+';var OPT='+JSON.stringify(k)+';\n'
  +(board?rd('src/board.js'):rd('src/page.js')+'\ndocument.getElementById("ttl").textContent=OPTS[OPT].nm;document.getElementById("cv").setAttribute("aria-label",OPTS[OPT].what);')
  +'\n</script></body></html>\n';}
Object.keys(FILES).forEach(k=>{const h=page(k);
 if(/\u2014|\u2013/.test(h))throw new Error(FILES[k]+' carries a dash that is not a hyphen');
 fs.writeFileSync(path.join(D,FILES[k]),h);console.log(FILES[k],(h.length/1024).toFixed(0)+' KB');});
