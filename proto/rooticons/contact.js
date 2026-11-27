/* ============================================================
   CONTACT SHEET. Every glyph the build already draws, at the size the rail
   draws it, beside the candidates. A new mark that looks like an old one is
   a second name for a different thing, so each candidate is looked at here
   against all of them before it is allowed near the rail.

     node proto/rooticons/contact.js
     NODE_PATH=/opt/node22/lib/node_modules node proto/rooticons/contact.js --shoot
   ============================================================ */
const fs=require('fs'),path=require('path'),cp=require('child_process');
const D=__dirname, ROOT=path.resolve(D,'..','..');
const {RI_GLYPH}=require('./glyphs.js');
const src=cp.execSync('git show HEAD:source.html',{cwd:ROOT,maxBuffer:64<<20}).toString('utf8');
const re=/nm:'([^']+)'[^}]*?ic:'([^']+)'/g; let m, have=[];
while((m=re.exec(src)))have.push([m[1],m[2]]);
const COL={Architect:'#7D93E0',Engine:'#D8924E',Weaver:'#5FD5A6',Witness:'#A77EDB'};
const svg=(d,px,c,sw)=>`<svg viewBox="0 0 24 24" width="${px}" height="${px}" style="stroke:${c};stroke-width:${sw||1.7};fill:none;stroke-linecap:round;stroke-linejoin:round"><path d="${d}"/></svg>`;
const tile=(d,c,nm)=>`<figure><div class="t">${svg(d,22,c)}</div><figcaption>${nm}</figcaption></figure>`;
let h=`<!doctype html><meta charset="utf-8"><title>Root glyph contact sheet</title><style>
body{background:#0E1015;color:#9AA3B2;font:12px/1.4 system-ui,sans-serif;margin:24px}
h2{font-weight:500;color:#D8DDE6;font-size:14px;margin:22px 0 10px}
.row{display:flex;flex-wrap:wrap;gap:8px}
figure{margin:0;width:62px;text-align:center}
.t{width:48px;height:48px;margin:0 auto;border-radius:6px;background:#161922;display:flex;align-items:center;justify-content:center}
figcaption{margin-top:4px;font-size:10.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.big{display:flex;gap:26px;flex-wrap:wrap}.big div{text-align:center}
</style>`;
for(const set of ['rec','alt']){
 h+=`<h2>${set==='rec'?'Recommended':'Alternate'}, at rail size and at 96</h2><div class="big">`;
 for(const r of Object.keys(COL))if(RI_GLYPH[set][r])h+=`<div>${svg(RI_GLYPH[set][r],96,COL[r],1.5)}<br>${tile(RI_GLYPH[set][r],COL[r],r)}</div>`;
 h+='</div>';}
h+=`<h2>Every named glyph already in the build (${have.length}), the ones a candidate must not echo</h2><div class="row">`;
for(const [nm,d] of have)h+=tile(d,'#B8C0CC',nm);
h+='</div>';
fs.writeFileSync(path.join(D,'contact.html'),h);
console.log('wrote contact.html,',have.length,'existing glyphs');
if(process.argv.includes('--shoot')){
 const {chromium}=require('playwright');
 (async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  const p=await b.newPage({viewport:{width:1100,height:900},deviceScaleFactor:2});
  await p.goto('file://'+path.join(D,'contact.html'));
  await p.screenshot({path:path.join(D,'shots','contact.png'),fullPage:true});
  await b.close();console.log('shot contact.png');})();}
