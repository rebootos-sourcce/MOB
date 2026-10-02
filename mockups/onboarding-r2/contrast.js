/* contrast.js. Measures text contrast in every frame against the element's own
   ground, not the page's: it walks up the element's ancestors, composites each
   translucent background over the one below it, and ends on the stage colour.
   SVG text takes its fill. Faint decorative ticks behind text are not counted,
   so a text sitting on the ring is checked against the panel, not the tick.
   Floors: 4.5 for text under 24 px (or 18.66 px bold), 3 for larger.
     NODE_PATH=/opt/node22/lib/node_modules node mockups/onboarding-r2/contrast.js [substring] */
const {chromium}=require('playwright');
const path=require('path'),fs=require('fs');
const FR=require('./frames.js');
const only=process.argv[2]||'';
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const res={};let worst=[];
 for(const fr of FR.list){
  if(fr.page==='strips.html')continue;
  if(only&&fr.png.indexOf(only)<0)continue;
  for(const [w,h] of [[1600,1000],[390,844]]){
   const ctx=await b.newContext({viewport:{width:w,height:h},reducedMotion:'reduce'});
   const p=await ctx.newPage();
   await p.goto('file://'+path.join(__dirname,fr.page)+'#'+fr.hash);
   await p.waitForTimeout(300);
   const out=await p.evaluate(()=>{
    function parse(c){const m=c.match(/rgba?\(([^)]+)\)/);if(!m)return null;const a=m[1].split(',').map(s=>parseFloat(s));return [a[0],a[1],a[2],a.length>3?a[3]:1];}
    function over(top,bot){const a=top[3];return [top[0]*a+bot[0]*(1-a),top[1]*a+bot[1]*(1-a),top[2]*a+bot[2]*(1-a),1];}
    function lum(c){const f=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4);};return .2126*f(c[0])+.7152*f(c[1])+.0722*f(c[2]);}
    function ratio(a,b){const A=lum(a),B=lum(b),hi=Math.max(A,B),lo=Math.min(A,B);return (hi+.05)/(lo+.05);}
    function ground(el){const chain=[];let e=el;while(e&&e.nodeType===1){const cs=getComputedStyle(e);const bg=parse(cs.backgroundColor);if(bg&&bg[3]>0)chain.push(bg);e=e.parentElement;}
     let g=[12,13,18,1];for(let i=chain.length-1;i>=0;i--)g=over(chain[i],g);return g;}
    const rows=[];
    const seen=new Set();
    document.querySelectorAll('body *').forEach(el=>{
     if(el.closest('noscript'))return;
     const isSvgText=el.tagName.toLowerCase()==='text';
     let own='';el.childNodes.forEach(n=>{if(n.nodeType===3)own+=n.textContent;});own=own.trim();
     if(!own)return;
     const cs=getComputedStyle(el);if(cs.visibility==='hidden'||cs.display==='none')return;
     const r=el.getBoundingClientRect();if(r.width<2||r.height<2||r.bottom<0||r.top>innerHeight||r.right<0||r.left>innerWidth)return;
     let op=1,e=el;while(e&&e.nodeType===1){op*=parseFloat(getComputedStyle(e).opacity);e=e.parentElement;}
     const fg=parse(isSvgText?cs.fill:cs.color);if(!fg)return;
     const gr=ground(isSvgText?(el.closest('svg')?el.closest('svg').parentElement:el):el);
     const f2=over([fg[0],fg[1],fg[2],fg[3]*op],gr);
     const fs=parseFloat(cs.fontSize),bold=parseInt(cs.fontWeight)>=700;
     const large=fs>=24||(fs>=18.66&&bold);
     const cr=ratio(f2,gr);
     const key=own+'|'+Math.round(r.left)+'|'+Math.round(r.top);if(seen.has(key))return;seen.add(key);
     rows.push({t:own.slice(0,40),cr:Math.round(cr*100)/100,fs:fs,floor:large?3:4.5});
    });
    return rows;});
   const bad=out.filter(r=>r.cr<r.floor);
   res[fr.png+'-'+w]={n:out.length,min:out.reduce((m,r)=>Math.min(m,r.cr),99),bad:bad};
   bad.forEach(r=>worst.push([fr.png+'-'+w,r.t,r.cr,r.floor,r.fs]));
   await ctx.close();
  }
 }
 fs.writeFileSync(path.join(__dirname,'contrast.json'),JSON.stringify(res,null,1));
 console.log('frames measured',Object.keys(res).length);
 const lowest=Object.keys(res).map(k=>res[k].min).reduce((a,b)=>Math.min(a,b),99);
 console.log('lowest text ratio on any frame',lowest);
 console.log('below floor:',worst.length);
 worst.slice(0,60).forEach(w=>console.log(w.join(' | ')));
 await b.close();
})();
