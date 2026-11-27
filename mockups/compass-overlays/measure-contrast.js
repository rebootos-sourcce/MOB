/* Contrast of the Compass panels and bar against their own ground, in every lighting.
   Run from the repo root: NODE_PATH=/opt/node22/lib/node_modules node mockups/compass-overlays/measure-contrast.js 1600 1000 source.html */
const {chromium}=require('playwright');const path=require('path');
const W=+(process.argv[2]||1600), H=+(process.argv[3]||1000);
const FILE=path.resolve(process.argv[4]||'source.html');
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const p=await b.newPage({viewport:{width:W,height:H}});
 await p.goto('file://'+FILE+'?dev=1');
 try{await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:12000});}catch(e){}
 await p.waitForTimeout(400);
 await p.evaluate(()=>{loadP(3);setTab(8);render();});
 await p.waitForTimeout(1200);
 const lights=['dark','snow','punch','glass','glasswhite','flat','lumen'];
 const rows=[];
 for(const L of lights){
  await p.evaluate(l=>{setLighting(l);render();},L);
  await p.waitForTimeout(900);
  const r=await p.evaluate(()=>{
   const parse=s=>{const cs=/color\(srgb ([^)]+)\)/.exec(s||'');if(cs){const t=cs[1].split(/[ \/]+/).map(parseFloat);return [t[0]*255,t[1]*255,t[2]*255,t.length>3?t[3]:1];}const m=/rgba?\(([^)]+)\)/.exec(s||'');if(!m)return null;const c=m[1].split(/[ ,\/]+/).filter(Boolean).map(parseFloat);return [c[0],c[1],c[2],c.length>3?c[3]:1];};
   const over=(f,bg)=>[0,1,2].map(i=>f[i]*f[3]+bg[i]*(1-f[3]));
   const ground=el=>{ // composite every translucent layer from the first opaque ancestor down
    const chain=[];for(let n=el;n&&n.nodeType===1;n=n.parentElement){const c=parse(getComputedStyle(n).backgroundColor);if(c&&c[3]>0)chain.push(c);if(c&&c[3]>=.999)break;}
    let g=[16,16,16];for(let i=chain.length-1;i>=0;i--){g=over(chain[i],g);}return g;};
   const lum=c=>{const f=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)};return .2126*f(c[0])+.7152*f(c[1])+.0722*f(c[2]);};
   const cr=(a,b)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
   const text=(el)=>{const cs=getComputedStyle(el);const fc=parse(cs.color);let op=1;for(let n=el;n&&n.nodeType===1&&n.id!=='cone';n=n.parentElement){op*=parseFloat(getComputedStyle(n).opacity);}
    const g=ground(el);const fg=over([fc[0],fc[1],fc[2],fc[3]*op],g);return +cr(fg,g).toFixed(2);};
   const out={};
   const row0=document.querySelector('#cone .cn-nms-l .cn-nr'), rowR=document.querySelector('#cone .cn-nms-r .cn-nr');
   out.q=text(row0.querySelector('.cn-nq'));
   out.up=Math.min(...[...document.querySelectorAll('#cone .cn-nu')].map(text));
   out.dn=Math.min(...[...document.querySelectorAll('#cone .cn-nd')].map(text));
   out.dnMax=Math.max(...[...document.querySelectorAll('#cone .cn-nd')].map(text));
   const pv=document.querySelector('#cone .cn-nr .fb-v');out.pill=text(pv);
   // orb glyph vs orb disc
   const gl=document.querySelector('#cone .cn-nr .fb-gl svg');const orb=document.querySelector('#cone .cn-nr .fb-orb');
   const gc=parse(getComputedStyle(gl).stroke);out.glyph=+cr(gc,over(parse(getComputedStyle(orb).backgroundColor),ground(orb.parentElement))).toFixed(2);
   const bo=document.querySelector('#cone .cnbar [data-cn="layers"] .fb-orb'), bg=document.querySelector('#cone .cnbar [data-cn="layers"] .fb-gl svg');
   const bgc=parse(getComputedStyle(bg).stroke);const bbg=over(parse(getComputedStyle(bo).backgroundColor),ground(bo.parentElement));
   out.barGlyphOff=+cr(bgc,bbg).toFixed(2);
   const panel=document.querySelector('#cone .cn-nms-l');out.panelLt=panel.classList.contains('fb-lt');out.barLt=document.getElementById('cnbar').classList.contains('fb-lt');
   // ring against its ground: the seat's colour on the orb disc
   const ring=document.querySelector('#cone .cn-nr .val');out.ring=+cr(parse(getComputedStyle(ring).stroke),over(parse(getComputedStyle(orb).backgroundColor),ground(orb.parentElement))).toFixed(2);
   return out;});
  rows.push([L,r]);}
 console.log('lighting      panel text q / up(min) / dn(min..max) / pill / glyph / ring / barGlyphOff');
 for(const [L,r] of rows)console.log(L.padEnd(12),'lt',r.panelLt?1:0,r.barLt?1:0,' q',r.q,' up',r.up,' dn',r.dn+'..'+r.dnMax,' pill',r.pill,' glyph',r.glyph,' ring',r.ring,' barOff',r.barGlyphOff);
 await b.close();})();
