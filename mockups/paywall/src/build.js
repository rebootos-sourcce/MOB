/* Paywall mockups, 17 October 2026. Joins the shared parts and one direction
   into a single self contained page per direction.
   Run from the repo root:  node mockups/paywall/src/build.js

   NOTHING ABOUT THE LADDER IS TYPED HERE. The tiers, their prices, their
   allowances, what each one opens and whether it can be bought are read out of
   atuned_src/engine/plan.js at build time, through the engine's own functions
   (planPrice, planAdds, planBuyable, sightRows). The six marks are the
   product's own paths: CHAINGLYPH in ui/component.js, the registers mark in
   ui/cone.js, the masks mark in ui/map.js, the padlock in ui/lock.js. The
   figure is engine/data/figure.js. The typeface is the Inter embedded in
   shell/head.html. So a mockup cannot print a price or a tier claim the
   product does not hold. */
const fs=require('fs'),path=require('path'),vm=require('vm');
const ROOT=path.resolve(__dirname,'../../..'),dir=__dirname,out=path.join(dir,'..');
const rd=f=>fs.readFileSync(path.join(dir,f),'utf8');
const src=f=>fs.readFileSync(path.join(ROOT,f),'utf8');

/* ---- the ladder, off the engine ---- */
const ctx={};vm.createContext(ctx);
vm.runInContext(src('atuned_src/engine/plan.js').replace(/\bconst\s+/g,'var '),ctx);
const E=ctx;
const tier=k=>({k,nm:E.PLAN_BY[k].nm,price:E.planPrice(k),grant:E.PLAN_BY[k].grant,per:E.PLAN_BY[k].per,
 adds:E.planAdds(k).map(g=>g.k),sees:E.planSeesAt(k).map(g=>g.k),buy:E.planBuyable(k)});
const LADDER={
 free:tier('free'),
 tiers:['one','two','three'].map(tier),
 four:tier('four'),
 sight:E.sightRows().map(g=>({k:g.k,nm:g.nm,need:g.need,what:g.what})),
 gift:E.GIFT_N};
if(LADDER.tiers.some(t=>t.price==null))throw new Error('a tier has no ruled price in plan.js');
if(LADDER.sight.some(g=>g.k==='kund'))throw new Error('an unbuilt row reached the paywall');

/* ---- the marks, off the UI ---- */
const comp=src('atuned_src/ui/component.js');
const cg=comp.match(/const CHAINGLYPH=\{([\s\S]*?)\};/);if(!cg)throw new Error('CHAINGLYPH not found');
const CHAIN=vm.runInNewContext('({'+cg[1]+'})');
const reg=src('atuned_src/ui/cone.js').match(/\breg:'(M8 19\.5[^']+)'/);if(!reg)throw new Error('registers mark not found');
const mask=src('atuned_src/ui/map.js').match(/masks:\{nm:'Masks',ic:'([^']+)'/);if(!mask)throw new Error('masks mark not found');
const lock=src('atuned_src/ui/lock.js').match(/const LOCK_PATH='([^']+)'/);if(!lock)throw new Error('padlock not found');
const GLYPH={sab:CHAIN.sab,cx:CHAIN.cx,hy:CHAIN.hy,sup:CHAIN.sup,reg:reg[1],mask:mask[1]};
const LOCK=lock[1];

/* ---- the figure, off the data ---- */
const fctx={};vm.createContext(fctx);
vm.runInContext(src('atuned_src/engine/data/figure.js').replace(/\bconst\s+/g,'var '),fctx);
const BODY={d:fctx.BODYPATH,s:fctx.PMS,tx:fctx.PMTX,ty:fctx.PMTY};

/* ---- the face ---- */
const head=src('atuned_src/shell/head.html');
const f0=head.indexOf("@font-face{font-family:'Inter'"),f1=head.indexOf('}',f0);
if(f0<0||f1<0)throw new Error('the embedded Inter was not found in head.html');
const FONT=head.slice(f0,f1+1);

const VERSIONS=[
 {id:'p1-three-flat-cards',n:1,name:'Three flat cards',file:'p1.js',css:'p1.css',theme:'punch'},
 {id:'p2-icon-grid',n:2,name:'Icon grid then plans',file:'p2.js',css:'p2.css',theme:'punch'},
 {id:'p3-figure-leads',n:3,name:'The figure leads',file:'p3.js',css:'p3.css',theme:'dark'},
 {id:'p4-one-plan',n:4,name:'One plan, one sentence',file:'p4.js',css:'p4.css',theme:'punch'},
 {id:'p5-flat-cards-v2',n:5,name:'Flat cards, second cut',file:'p5.js',css:'p5.css',theme:'punch'}];
const pick=process.argv[2]?process.argv[2].split(','):null;
VERSIONS.forEach(v=>{
 if(!fs.existsSync(path.join(dir,v.file)))return;
 if(pick&&!pick.some(p=>v.id.startsWith(p)))return;
 const html='<!doctype html>\n<html lang="en"><head><meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n'
  +'<title>Paywall, '+v.name.toLowerCase()+'</title>\n<style>\n'+FONT+'\n'+rd('shared.css')+'\n'+rd(v.css)+'\n</style></head>\n'
  +'<body class="'+(v.theme==='punch'?'punch':'dark')+'">\n'
  +'<noscript><p style="padding:24px;color:#EFEDE8">This mockup draws with script. Open it in a browser with script on.</p></noscript>\n'
  +'<div id="app"></div>\n<script>\n"use strict";\n'
  +'const VERSION='+JSON.stringify({id:v.id,n:v.n,name:v.name})+';\n'
  +'const VERSIONS='+JSON.stringify(VERSIONS.map(x=>({id:x.id,n:x.n,name:x.name})))+';\n'
  +'const LADDER='+JSON.stringify(LADDER)+';\nconst GLYPH='+JSON.stringify(GLYPH)+';\nconst LOCK='+JSON.stringify(LOCK)+';\n'
  +'const BODY='+JSON.stringify(BODY)+';\n'+rd('shared.js')+'\n'+rd(v.file)+'\n</script>\n</body></html>\n';
 if(html.indexOf('—')>=0)throw new Error('em dash in '+v.id);
 if(/https?:\/\//.test(html.replace(/http:\/\/www\.w3\.org\/2000\/svg/g,'')))throw new Error('a network address in '+v.id);
 fs.writeFileSync(path.join(out,v.id+'.html'),html);
 console.log('wrote',v.id+'.html',Math.round(html.length/1024)+' KB');});
console.log('ladder',LADDER.tiers.map(t=>t.nm+' $'+t.price+' '+t.grant+' adds '+t.adds.join('+')).join(' | '),'| four $'+LADDER.four.price+' buy '+LADDER.four.buy);
