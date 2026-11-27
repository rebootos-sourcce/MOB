/* Achievements mockups, round of 16 October 2026. Joins the shared parts and one
   direction into a single self-contained page per direction.
   Run from the repo root:  node mockups/achievements/src/build.js

   The body outline, every address's place on it, the address names and the
   saboteur and hypercomplex families are read out of the product's own data
   files at build time (atuned_src/engine/data/figure.js and nodes.js), and the
   placement is ported line for line from pmAnat in atuned_src/ui/map.js. So a
   ring in a mockup lands on the pixel the Body page would put that address on,
   and nothing here is a second copy that can drift. */
const fs=require('fs'),path=require('path'),vm=require('vm');
const ROOT=path.resolve(__dirname,'../../..'),dir=__dirname,out=path.join(dir,'..');
const rd=f=>fs.readFileSync(path.join(dir,f),'utf8');

/* ---- the product's data ---- */
const ctx={};vm.createContext(ctx);
vm.runInContext(['atuned_src/engine/data/nodes.js','atuned_src/engine/data/figure.js']
 .map(f=>fs.readFileSync(path.join(ROOT,f),'utf8')).join('\n').replace(/\bconst\s+/g,'var '),ctx);
const {NODES,SAB_LIB,HCX_LIB,ANAT,ANATHEAD,ANATSPINE,BODYPATH,PMS,PMTX,PMTY}=ctx;

/* pmAnat, ui/map.js:41, ported. Only rows with a measured place are used: an
   address with no row keeps a hashed spot in the product, which is not a place,
   so the mockups simply never release one of those. */
function anat(){
 const PMSPREAD=1.2,PMGAP=1.45,PMROAM=2.2,H=ANATHEAD,mm=(H.topZ-H.earZ)/(H.year-H.ytop),o={};
 const spine=lv=>{const R=ANATSPINE;let i=0;while(i<R.length-2&&lv>R[i+1][0])i++;const a=R[i],b=R[i+1];return a[1]+(lv-a[0])*(b[1]-a[1])/(b[0]-a[0]);};
 ANAT.forEach(row=>{if(row.at)return;
  const pts=row.h?row.h.map(p=>({x:50-p[0]/mm,y:H.ytop+(H.topZ-p[1])/mm}))
   :row.v?row.v.map(p=>({x:50+p[1],y:spine(p[0])})):row.f.map(p=>({x:p[0],y:p[1]}));
  const at=pts.map(()=>[]);row.ids.forEach((id,j)=>at[j%pts.length].push(id));
  at.forEach((ids,pi)=>{const c=pts[pi],n=ids.length,a0=(n%2)?-Math.PI/2:((row.v||row.f)?-Math.PI/4:Math.PI);
   ids.forEach((id,j)=>{const t=a0+j*2*Math.PI/n,r=n>1?PMSPREAD:0;
    /* a two sided place gives an address one point per side; the first wins, as on the Body page */
    if(!o[id])o[id]={x:c.x+Math.cos(t)*r,y:c.y+Math.sin(t)*r,hx:c.x,hy:c.y};});});});
 const ids=Object.keys(o).sort((a,b)=>a-b);
 for(let it=0;it<80;it++){
  for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++){
   const p=o[ids[i]],q=o[ids[j]];let dx=q.x-p.x,dy=q.y-p.y,d=Math.sqrt(dx*dx+dy*dy);
   if(d>=PMGAP)continue;if(d<1e-6){const t0=(+ids[j])*2.399;dx=Math.cos(t0);dy=Math.sin(t0);d=1;}
   const push=(PMGAP-d)/2/d;p.x-=dx*push;p.y-=dy*push;q.x+=dx*push;q.y+=dy*push;}
  ids.forEach(id=>{const m=o[id],ox=m.x-m.hx,oy=m.y-m.hy,r=Math.sqrt(ox*ox+oy*oy);
   if(r>PMROAM){m.x=m.hx+ox*PMROAM/r;m.y=m.hy+oy*PMROAM/r;}});}
 const P={};ids.forEach(id=>P[id]=[+o[id].x.toFixed(2),+o[id].y.toFixed(2)]);return P;}

const DATA={
 place:anat(),
 node:Object.fromEntries(NODES.map(n=>[n.i,{n:n.n,k:n.k,b:n.b}])),
 sab:SAB_LIB.map(s=>({nm:s.nm,ids:s.nids})),
 hcx:HCX_LIB.map(h=>({nm:h.nm,d:h.d})),
 body:{d:BODYPATH,s:PMS,tx:PMTX,ty:PMTY}};

const VERSIONS=[
 {id:'v1-body-with-rings',n:1,name:'Body with rings',file:'v1.js',css:'v1.css'},
 {id:'v2-dial',n:2,name:'Dial',file:'v2.js',css:'v2.css'},
 {id:'v3-field',n:3,name:'Field',file:'v3.js',css:'v3.css'},
 {id:'v4-receipt',n:4,name:'Receipt',file:'v4.js',css:'v4.css'}];
/* the product's own Inter, the one face, lifted out of the shell so the mockups
   set type exactly as the app does and fetch nothing */
const head=fs.readFileSync(path.join(ROOT,'atuned_src/shell/head.html'),'utf8');
const f0=head.indexOf("@font-face{font-family:'Inter'"),f1=head.indexOf('}',f0);
if(f0<0||f1<0)throw new Error('the embedded Inter was not found in head.html');
const FONT=head.slice(f0,f1+1);
const css=FONT+'\n'+rd('shared.css'),js=rd('shared.js');
VERSIONS.forEach(v=>{
 if(!fs.existsSync(path.join(dir,v.file)))return;
 const html='<!doctype html>\n<html lang="en"><head><meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n'
  +'<title>Achievements, '+v.name.toLowerCase()+'</title>\n<style>\n'+css+'\n'+rd(v.css)+'\n</style></head>\n<body>\n'
  +'<noscript><p style="padding:24px;color:#EFEDE8">This mockup draws with script. Open it in a browser with script on.</p></noscript>\n'
  +'<div id="app"></div>\n<script>\n"use strict";\n'
  +'const VERSION='+JSON.stringify({id:v.id,n:v.n,name:v.name})+';\n'
  +'const VERSIONS='+JSON.stringify(VERSIONS.map(x=>({id:x.id,n:x.n,name:x.name})))+';\n'
  +'const DATA='+JSON.stringify(DATA)+';\n'+js+'\n'+rd(v.file)+'\n</script>\n</body></html>\n';
 if(html.indexOf('—')>=0)throw new Error('em dash in '+v.id);
 if(/https?:\/\//.test(html.replace(/http:\/\/www\.w3\.org\/2000\/svg/g,'')))throw new Error('a network address in '+v.id);
 fs.writeFileSync(path.join(out,v.id+'.html'),html);
 console.log('wrote',v.id+'.html',Math.round(html.length/1024)+' KB');});
