/* plate.svg, questions.svg and merge.svg to PNG, through Chromium so the text renders
   the way the product's own does. Run from the repo root after gen.js:
     NODE_PATH=/opt/node22/lib/node_modules node proto/body-map-spec/render.js */
const {chromium}=require('playwright');
const path=require('path'), fs=require('fs');
(async()=>{
 const b=await chromium.launch();
 for(const n of ['plate','questions','merge']){
  const f=path.join(__dirname,n+'.svg'), s=fs.readFileSync(f,'utf8');
  const [w,h]=s.match(/width="(\d+)" height="(\d+)"/).slice(1).map(Number);
  const p=await b.newPage({viewport:{width:w,height:h}});
  await p.setContent('<html><body style="margin:0;background:#101217">'+s+'</body></html>');
  await p.screenshot({path:path.join(__dirname,n+'.png'),clip:{x:0,y:0,width:w,height:h}});
  await p.close();
  console.log(n+'.png',w+'x'+h);
 }
 await b.close();
})();
