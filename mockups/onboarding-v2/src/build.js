/* build.js. Assembles index.html from src/. Run from anywhere:  node mockups/onboarding-v2/src/build.js
   The font is the one the product carries (Inter, latin, variable, base64) lifted from the Login A mockup, and the 112
   addresses are read out of the engine's own table, so the mockup shows real rows and not typed ones. */
var fs=require('fs'),path=require('path');
var root=path.join(__dirname,'..'),repo=path.join(root,'..','..');
var css=fs.readFileSync(path.join(__dirname,'style.css'),'utf8');
var body=fs.readFileSync(path.join(__dirname,'body.html'),'utf8');
/* the script is src/js/NN-name.js joined in name order inside one function (01 opens it, 06 closes it) */
var js=fs.readdirSync(path.join(__dirname,'js')).filter(function(f){return /^\d\d-.*\.js$/.test(f);}).sort().map(function(f){return fs.readFileSync(path.join(__dirname,'js',f),'utf8');}).join('\n');
var login=fs.readFileSync(path.join(repo,'mockups/onboarding/login-a.html'),'utf8');
var font="@font-face{font-family:'Onest';font-style:normal;font-weight:300 700;font-display:block;src:url(data:font/woff2;base64,"+fs.readFileSync(path.join(repo,'mockups/fonts/files/onest-latin-300-700.woff2')).toString('base64')+") format('woff2')}";
var nodesSrc=fs.readFileSync(path.join(repo,'atuned_src/engine/data/nodes.js'),'utf8');
var N=JSON.parse(nodesSrc.match(/const NODES=\n(\[.*\]);/)[1]);
var rows=N.map(function(n){return [n.i,n.k,n.b,n.n];});
js=js.replace('/*NODES*/[]/*END*/',JSON.stringify(rows));
var html='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
 +'<title>Onboarding v2 mockup</title><style>'+font+'\n'+css+'</style></head><body>'
 +'<noscript>This mockup draws with script. Nothing is fetched.</noscript>'+body+'<script>'+js+'</script></body></html>';
fs.writeFileSync(path.join(root,'index.html'),html);
console.log('index.html',html.length,'bytes');

/* strip.html: the contact sheet, every beat at 390 side by side, read off the png folder so it cannot list a shot that is not there. */
var png=fs.readdirSync(path.join(root,'png')).filter(function(f){return /^390-/.test(f);}).sort();
var cells=png.map(function(f){var nm=f.replace(/^390-\d+-/,'').replace(/\.png$/,'').replace(/-/g,' ');var n=f.match(/^390-(\d+)/)[1];
 return '<figure><img src="png/'+f+'" width="390" height="844" alt="'+nm+'"><figcaption>'+n+' '+nm+'</figcaption></figure>';}).join('');
fs.writeFileSync(path.join(root,'strip.html'),'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Onboarding v2 at 390</title>'
 +'<style>body{margin:0;background:#0a0a0f;color:#B4B0A8;font:13px/20px system-ui,sans-serif}h1{font-size:16px;font-weight:600;color:#EFEDE8;margin:16px 16px 4px}p{margin:0 16px 12px}'
 +'.row{display:flex;gap:16px;padding:0 16px 24px;overflow-x:auto}figure{margin:0;flex:none}img{display:block;border-radius:12px;border:1px solid rgba(255,255,255,.12);width:390px;height:auto}figcaption{padding:6px 2px}</style></head><body>'
 +'<h1>Onboarding v2, every beat at 390 by 844</h1><p>Scroll sideways. Frames are frozen at the instant named in src/shots.js. Open index.html to watch it move.</p><div class="row">'+cells+'</div></body></html>');
console.log('strip.html',png.length,'beats');
