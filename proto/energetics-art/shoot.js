/* Screenshots of the three Energetics mockups at 1600 and 390, with console
   errors, outbound requests and sideways scroll counted. From the repo root:
     NODE_PATH=/opt/node22/lib/node_modules node proto/energetics-art/shoot.js */
const {chromium}=require('playwright'), path=require('path'), fs=require('fs');
const D=__dirname, OUT=path.join(D,'shots'); fs.mkdirSync(OUT,{recursive:true});
const F='file://'+path.join(D,'energetics-art-packed.html');
const SHOTS=[['a-marcus','mode=a&who=Marcus&law=4'],['b-marcus','mode=b&who=Marcus&law=4'],['c-marcus','mode=c&who=Marcus&law=4'],
 ['a-blank','mode=a&who=You&law=0'],['b-blank','mode=b&who=You&law=0'],['c-blank','mode=c&who=You&law=0']];
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 let errs=0, reqs=0;
 for(const [W,H] of [[1600,1000],[390,844]]){
  for(const [nm,hash] of SHOTS){const p=await b.newPage({viewport:{width:W,height:H}});
   p.on('pageerror',e=>{errs++;console.log('error',nm,W,e.message);});
   p.on('request',r=>{if(!/^(file|data):/.test(r.url()))reqs++;});
   await p.goto(F+'#'+hash);await p.waitForTimeout(1200);
   await p.screenshot({path:path.join(OUT,nm+'-'+W+'.png')});
   if(W<500)await p.screenshot({path:path.join(OUT,nm+'-'+W+'-full.png'),fullPage:true});
   const m=await p.evaluate(()=>({sw:document.documentElement.scrollWidth,
    small:[...document.querySelectorAll('#view .sc button')].filter(e=>{const r=e.getBoundingClientRect();return r.width<44||r.height<44;}).length}));
   if(m.sw>W)console.log('sideways scroll',nm,W,m.sw);
   if(m.small)console.log('answer points under 44',nm,W,m.small);
   await p.close();}}
 console.log('errors',errs,'outbound requests',reqs);await b.close();})();
