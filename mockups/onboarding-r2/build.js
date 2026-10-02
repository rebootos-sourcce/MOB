/* build.js. Assembles the self-contained mockup pages from src/.
   Run from the repo root:  node mockups/onboarding-r2/build.js
   It reads the Inter font out of the app's own head.html so the type is the
   product's type. It writes only into mockups/onboarding-r2/. It does not
   touch atuned_src/ or source.html. Round PA revision of mockups/onboarding. */
var fs=require('fs'),path=require('path');
var root=path.join(__dirname),src=path.join(root,'src');
function rd(p){return fs.readFileSync(p,'utf8');}
var head=rd(path.join(__dirname,'..','..','atuned_src','shell','head.html'));
var m=head.match(/@font-face\{font-family:'Inter'[\s\S]*?\}\s*\n?/);
var font=m?m[0]:'';
if(!font)throw new Error('Inter font-face not found in head.html');
var kitcss=rd(path.join(src,'kit.css')),kitjs=rd(path.join(src,'kit.js'));
function opt(n){var p=path.join(src,n);return fs.existsSync(p)?rd(p):'';}
var scenes=function(){return rd(path.join(src,'scenes.js'))+'\n'+rd(path.join(src,'scenes2.js'))+'\n'+opt('wheel.js')+'\n'+opt('scenes3.js')+'\n'+opt('scenes4.js');};
function page(file,title,bodyClass,css,js){
 var html='<!doctype html><html lang="en"><head><meta charset="utf-8">'
  +'<meta name="viewport" content="width=device-width,initial-scale=1">'
  +'<title>'+title+'</title><style>'+font+kitcss+css+'</style></head>'
  +'<body class="'+bodyClass+'"><noscript>This mockup draws with script. Nothing is fetched.</noscript>'
  +'<script>'+kitjs+'\n'+js+'</script></body></html>';
 fs.writeFileSync(path.join(root,file),html);
 console.log(file,Math.round(html.length/1024)+' KB');}
page('login-a.html','Login, the ring','A',rd(path.join(src,'login.css')),rd(path.join(src,'loginring.js'))+'\n'+rd(path.join(src,'login.js')));
page('onboarding.html','Onboarding, round PA','flow',rd(path.join(src,'flow.css'))+opt('flow2.css'),scenes()+'\n'+rd(path.join(src,'flow.js')));
page('tutorial.html','Tutorial, round PA','tut',rd(path.join(src,'flow.css'))+opt('flow2.css')+rd(path.join(src,'tutorial.css')),scenes()+'\n'+rd(path.join(src,'tutorial.js')));
page('strips.html','Frame strips, round PA','strips',rd(path.join(src,'strips.css'))+opt('flow2.css')+rd(path.join(src,'login.css')),rd(path.join(src,'loginring.js'))+'\n'+scenes()+'\n'+rd(path.join(src,'strips.js')));
