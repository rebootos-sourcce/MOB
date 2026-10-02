// Builds ../specimen.html: every candidate embedded as base64 woff2, so the sheet is one file like the product.
// usage: node build.js   (needs FONTS_DIR, the scratch npm install of @fontsource packages)
const fs=require('fs'),path=require('path');
const FD=process.env.FONTS_DIR; if(!FD){console.error('set FONTS_DIR');process.exit(1);}
const list=JSON.parse(fs.readFileSync(path.join(__dirname,'fonts.json')));
let faces='';
for(const f of list){
  const b64=fs.readFileSync(path.join(FD,'node_modules',f.pkg,'files',f.file)).toString('base64');
  faces+=`@font-face{font-family:'${f.slug}';font-style:normal;font-weight:${f.w};font-display:block;src:url(data:font/woff2;base64,${b64}) format('woff2')}\n`;
}
const meta=fs.existsSync(path.join(__dirname,'meta.json'))?fs.readFileSync(path.join(__dirname,'meta.json'),'utf8'):'{}';
const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Font specimen</title>
<style>
${faces}
:root{--stage:#06060a;--panel:#1A1D26;--panel-2:#252833;--edge:rgba(255,255,255,.09);--edge-2:rgba(255,255,255,.14);
 --ink:#EFEDE8;--mid:#B4B0A8;--dim:#94908A;--accent:#7EB8D4;--on-accent:#0B1418;--alarm:#FF2E1F;
 --root:#D6524C;--sacral:#D8924E;--solar:#DABF6A;--heart:#5FD5A6;--throat:#5EBBDB;--eye:#7D93E0;--crown:#A77EDB;
 --meta:'inter',system-ui,sans-serif;--ui:'inter';--mono:'geist-mono'}
*{box-sizing:border-box}
html,body{margin:0;background:var(--stage);color:var(--ink);-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%}
body{font-family:var(--ui),system-ui,sans-serif;font-size:16px;line-height:1.5}
.page{max-width:1600px;margin:0 auto;padding:40px 48px 64px}
.meta{font:400 11px/16px var(--meta);color:var(--dim);display:flex;flex-wrap:wrap;gap:4px 18px;padding-bottom:20px;border-bottom:1px solid var(--edge)}
.meta b{color:var(--mid);font-weight:500}
.hd{display:flex;align-items:baseline;gap:14px;margin:20px 0 0}
.hd h1{font:500 13px/20px var(--meta);margin:0;color:var(--mid)}
.mark{font-family:var(--ui);font-weight:600;letter-spacing:-.02em;font-size:148px;line-height:1.05;margin:20px 0 4px;color:var(--ink)}
.mark2{display:flex;gap:40px;align-items:baseline;color:var(--mid);font-size:44px;letter-spacing:-.02em;line-height:1.2}
.mark2 span{font-size:11px;font-family:var(--meta);color:var(--dim);letter-spacing:.02em}
.hero{margin:56px auto 14px;font-weight:300;font-size:44px;line-height:52px;letter-spacing:-.02em;text-align:center;max-width:17em;text-wrap:balance}
.sub{margin:0 auto 0;text-align:center;font-size:20px;line-height:28px;color:var(--mid)}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:48px}
.panel{background:var(--panel);border:1px solid var(--edge);border-radius:16px;padding:24px}
.cap{font:400 11px/16px var(--meta);color:var(--dim);margin:0 0 12px}
.lab{font-size:13px;line-height:20px;color:var(--dim);margin:0 0 6px}
.inp{height:44px;border:1px solid var(--edge-2);border-radius:11px;background:#0e1015;display:flex;align-items:center;padding:0 14px;color:var(--mid);font-size:16px;letter-spacing:.14em}
.row{display:flex;flex-wrap:wrap;gap:10px;margin-top:16px}
.ring{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 22px;border-radius:999px;border:1.5px solid rgba(239,237,232,.6);background:transparent;color:var(--ink);font:500 16px/20px var(--ui);white-space:nowrap}
.ring.pri{border-color:var(--accent);color:var(--accent)}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:20px}
.chip{display:inline-flex;align-items:center;gap:7px;min-height:30px;padding:0 12px;border-radius:999px;border:1.5px solid var(--c);color:var(--ink);font-size:13px;font-weight:500;white-space:nowrap}
.chip i{width:8px;height:8px;border-radius:50%;border:1.5px solid var(--c);display:block}
.read{display:grid;grid-template-columns:1fr 1fr;gap:20px}
.big{font-size:44px;line-height:52px;font-weight:500;letter-spacing:-.01em;font-variant-numeric:tabular-nums;white-space:nowrap}
.big small{font-size:13px;color:var(--dim);font-weight:400;letter-spacing:0;margin-left:6px}
.col{font-size:16px;line-height:24px;font-weight:500;color:var(--mid);text-align:right;width:max-content}
.col div{white-space:nowrap}
.tn{font-variant-numeric:tabular-nums}
.mono{font-family:var(--mono),ui-monospace,monospace;font-variant-numeric:tabular-nums}
.para{font-size:16px;line-height:1.65;color:rgba(239,237,232,.85);max-width:62ch;margin:0}
.u{display:flex;gap:28px;align-items:baseline;flex-wrap:wrap}
.u14{font-size:14px;line-height:20px;color:var(--ink)}
.u56{font-size:56px;line-height:64px;font-weight:500;letter-spacing:-.02em}
.wts{display:flex;flex-wrap:wrap;gap:6px 22px;font-size:20px;line-height:28px;color:var(--mid)}
.span2{grid-column:1/-1}
/* contact sheet */
.sheet{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;padding:32px 32px 48px}
.card{background:var(--panel);border:1px solid var(--edge);border-radius:16px;padding:20px 22px;overflow:hidden}
.card .nm{font:500 13px/20px var(--meta);color:var(--mid)}
.card .mk{font-size:76px;line-height:84px;font-weight:600;letter-spacing:-.02em;margin:6px 0 2px}
.card .hl{font-size:26px;line-height:32px;font-weight:300;letter-spacing:-.02em;margin:0 0 12px;max-width:17em}
.card .bt{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}
.card .bt .ring{min-height:38px;padding:0 16px;font-size:14px}
.card .cqq{font-size:30px;line-height:36px;font-weight:500;font-variant-numeric:tabular-nums}
.card .u14{margin-top:6px}
@media (max-width:640px){
 .page{padding:24px 16px 48px}
 .mark{font-size:76px;margin-top:16px}
 .mark2{font-size:28px;gap:20px;flex-wrap:wrap}
 .hero{font-weight:400;font-size:28px;line-height:36px;margin-top:36px}
 .sub{font-size:16px;line-height:24px}
 .grid,.read{grid-template-columns:1fr}
 .grid{margin-top:32px;gap:14px}
 .panel{padding:18px}
 .big{font-size:36px;line-height:44px}
 .u56{font-size:44px;line-height:52px}
 .wts{font-size:16px;gap:4px 14px}
 .sheet{grid-template-columns:1fr;padding:16px}
}
</style></head><body>
<div id="root"></div>
<script>
const LIST=${JSON.stringify(list)};const META=${meta};
const q=new URLSearchParams(location.search);
const root=document.getElementById('root');
const seats=[['Root','--root'],['Sacral','--sacral'],['Solar plexus','--solar'],['Heart','--heart'],['Throat','--throat'],['3rd eye','--eye'],['Crown','--crown']];
const PARA='I am releasing believing, thinking, feeling, behaving and acting that I am not enough. It sits in the chest. It costs sleep, and it costs the first minute of every conversation. Name it. Let it go. Notice what moves.';
function bySlug(s){return LIST.find(x=>x.slug===s)}
function m(slug){const f=bySlug(slug)||{};return META[slug]||{}}
function metaLine(f){const t=META[f.slug]||{};
 return '<div class="meta"><span><b>'+f.name+'</b></span><span>'+(f.role==='baseline'?'incumbent':f.role==='mono'?'readout mono':'ui face')+'</span><span>'+f.cat+'</span><span>weights <b>'+f.w+'</b></span><span>latin woff2 <b>'+(t.kb||'?')+' KB</b> raw, <b>'+(t.b64||'?')+' KB</b> base64</span><span>x height <b>'+(t.xh||'?')+'</b> of cap</span><span>licence <b>SIL OFL 1.1</b></span></div>';}
function page(f){
 const mono=f.role==='mono';
 const ui=mono?'inter':f.slug, mn=mono?f.slug:'geist-mono';
 document.documentElement.style.setProperty('--ui',"'"+ui+"'");document.documentElement.style.setProperty('--mono',"'"+mn+"'");
 const hero='There is more running you than you can see.';
 root.innerHTML='<div class="page">'+metaLine(f)+
 '<div class="mark">atüned</div>'+
 '<div class="mark2"><div style="font-weight:300">atüned <span>300</span></div><div style="font-weight:400">atüned <span>400</span></div><div style="font-weight:700">atüned <span>700</span></div></div>'+
 '<h2 class="hero">'+hero+'</h2><p class="sub">Atüned is a mirror that sees through you.</p>'+
 '<div class="grid">'+
  '<div class="panel"><p class="cap">Sign in. Field label, input, rings at 44 px</p><p class="lab">Password</p><div class="inp">&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;</div>'+
  '<div class="row"><span class="ring pri">Log in</span><span class="ring">Guest</span><span class="ring">Create account</span></div>'+
  '<div class="chips">'+seats.map(s=>'<span class="chip" style="--c:var('+s[1]+')"><i></i>'+s[0]+'</span>').join('')+'</div></div>'+
  '<div class="panel"><p class="cap">Readout. Tabular figures, '+(mono?'this mono':'UI face, then Geist Mono')+'</p><div class="read"><div>'+
   '<div class="big">CQ 62.4<small>of 100</small></div>'+
   '<div class="col" style="margin-top:12px"><div>CQ 62.4</div><div>CQ 100.0</div><div>CQ 8.8</div><div>CQ 111.1</div></div></div>'+
   '<div><div class="big mono">CQ 62.4</div><div class="col mono" style="margin-top:12px"><div>CQ 62.4</div><div>CQ 100.0</div><div>CQ 8.8</div><div>CQ 111.1</div></div></div></div>'+
   '<p class="cap" style="margin:14px 0 4px">Proportional digits, then tabular</p><div style="display:flex;gap:30px"><div class="col" style="font-variant-numeric:proportional-nums"><div>1111</div><div>0000</div><div>8888</div></div><div class="col tn"><div>1111</div><div>0000</div><div>8888</div></div></div></div>'+
  '<div class="panel"><p class="cap">Voice. 16 px on 1.65</p><p class="para">'+PARA+'</p></div>'+
  '<div class="panel"><p class="cap">The u with a diaeresis. 14 px, then 56 px</p><div class="u"><span class="u14">atuned atüned u ü</span></div><div class="u" style="margin-top:8px"><span class="u56">u ü atüned</span></div>'+
  '<p class="cap" style="margin:14px 0 6px">Weights</p><div class="wts"><span style="font-weight:300">300 light</span><span style="font-weight:400">400 regular</span><span style="font-weight:500">500 medium</span><span style="font-weight:600">600 semibold</span><span style="font-weight:700">700 bold</span></div></div>'+
 '</div></div>';
}
function sheet(){
 root.innerHTML='<div class="sheet">'+LIST.filter(f=>f.role!=='mono').map(f=>{const t=META[f.slug]||{};
  return '<div class="card" style="font-family:\\''+f.slug+'\\'"><div class="nm">'+f.name+' &nbsp;'+(t.b64||'?')+' KB base64 &nbsp; weights '+f.w+'</div><div class="mk">atüned</div><p class="hl">There is more running you than you can see.</p><div class="bt"><span class="ring pri" style="font-family:inherit">Log in</span><span class="ring" style="font-family:inherit">Guest</span><span class="ring" style="font-family:inherit">Create account</span></div><div class="cqq">CQ 62.4</div><div class="u14">Atüned is a mirror that sees through you.</div></div>';}).join('')+'</div>';
}
function monoSheet(){
 root.innerHTML='<div class="sheet">'+LIST.filter(f=>f.role==='mono').map(f=>{const t=META[f.slug]||{};
  return '<div class="card" style="font-family:\\''+f.slug+'\\';font-variant-numeric:tabular-nums"><div class="nm">'+f.name+' &nbsp;'+(t.b64||'?')+' KB base64 &nbsp; weights '+f.w+'</div><div class="mk" style="font-size:60px;line-height:68px">CQ 62.4</div><div class="col" style="font-size:20px;line-height:28px"><div>CQ 62.4</div><div>CQ 100.0</div><div>CQ 8.8</div><div>CQ 111.1</div></div><div class="u14" style="font-size:13px;margin-top:10px">0.874  1,204  +3.2  atüned  ü</div></div>';}).join('')+'</div>';
}
const f=q.get('f');
if(f==='monos')monoSheet();else if(f&&bySlug(f))page(bySlug(f));else sheet();
</script></body></html>`;
fs.writeFileSync(path.join(__dirname,'..','specimen.html'),html);
console.log('wrote specimen.html',(html.length/1024|0)+' KB');
