/* build.js. Assembles the self-contained mockup pages from src/.
   Run from the repo root:  node mockups/onboarding/build.js
   It reads the Inter font out of the app's own head.html so the type is the
   product's type. It writes only into mockups/onboarding/. It does not touch
   atuned_src/ or source.html. */
var fs=require('fs'),path=require('path');
var root=path.join(__dirname),src=path.join(root,'src');
function rd(p){return fs.readFileSync(p,'utf8');}
var head=rd(path.join(__dirname,'..','..','atuned_src','shell','head.html'));
var m=head.match(/@font-face\{font-family:'Inter'[\s\S]*?\}\s*\n?/);
var font=m?m[0]:'';
if(!font)throw new Error('Inter font-face not found in head.html');
/* THE LAWS ARE READ OUT OF THE ENGINE'S OWN TABLE, not retyped. canon.js holds
   the 21 laws with their seat and their mark, and a copy here would drift. The
   block between "const SI=[" and "];" is a plain array literal, so it is read
   as one. lawsjs becomes a var in front of the page's script. */
var canon=rd(path.join(__dirname,'..','..','atuned_src','engine','data','canon.js'));
var sm=canon.match(/const SI=\[([\s\S]*?)\];/);
if(!sm)throw new Error('SI table not found in canon.js');
var SI=new Function('return ['+sm[1]+'];')();
if(SI.length!==21)throw new Error('expected 21 laws, read '+SI.length);
var lawsjs='var LAWS='+JSON.stringify(SI)+';\n';
var kitcss=rd(path.join(src,'kit.css')),kitjs=rd(path.join(src,'kit.js'));
var scenes=function(){return rd(path.join(src,'scenes.js'))+'\n'+rd(path.join(src,'scenes2.js'));};
function page(file,title,bodyClass,css,js){
 var html='<!doctype html><html lang="en"><head><meta charset="utf-8">'
  +'<meta name="viewport" content="width=device-width,initial-scale=1">'
  +'<title>'+title+'</title><style>'+font+kitcss+css+'</style></head>'
  +'<body class="'+bodyClass+'"><noscript>This mockup draws with script. Nothing is fetched.</noscript>'
  +'<script>'+kitjs+'\n'+js+'</script></body></html>';
 fs.writeFileSync(path.join(root,file),html);
 console.log(file,Math.round(html.length/1024)+' KB');}
var lcss=rd(path.join(src,'login.css')),ljs=rd(path.join(src,'login.js'));
page('login-a.html','Login A, the ring','A',lcss,ljs);
page('login-b.html','Login B, the bands','B',lcss,ljs);
page('login-c.html','Login C, the address grid','C',lcss,ljs);
['flow','tutorial','strips'].forEach(function(n){
 var cp=path.join(src,n+'.css'),jp=path.join(src,n+'.js');
 if(!fs.existsSync(jp))return;
 var css=fs.existsSync(cp)?rd(cp):'';
 if(n==='flow')page('onboarding.html','Onboarding','flow',css,scenes()+'\n'+rd(jp));
 if(n==='tutorial')page('tutorial.html','Tutorial','tut',rd(path.join(src,'flow.css'))+css,lawsjs+scenes()+'\n'+rd(jp));
 if(n==='strips')page('strips.html','Frame strips','strips',css,scenes()+'\n'+rd(jp));
});
