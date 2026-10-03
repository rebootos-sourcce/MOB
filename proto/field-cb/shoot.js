/* THE SHOOTER for the round CB comps. The house pattern, after
   proto/field-rings/shoot.js: the same Chromium, every page request logged,
   and a request that leaves the machine fails the run. Background networking
   is switched off at launch, because Chromium's own update pings otherwise
   land in the proxy log and read like the page reaching out.

   Each page sets window.__ready when it has drawn, and a page error or a
   console error fails the run, so a comp that threw halfway is never shot
   as if it were finished.

   Run from the repo root, after capture.js:
     NODE_PATH=/opt/node22/lib/node_modules node proto/field-cb/shoot.js [name ...] */
const {chromium}=require('playwright');
const path=require('path'),fs=require('fs');
const DIR=__dirname,SHOTS=path.join(DIR,'shots');
const EXE='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
/* name, page, query, viewport width, height, full page */
const ALL=[
 ['1-centre-1600','1-centre.html','',1600,1000,true],
 ['1-field-1600','1-field.html','',1600,1000,false],
 ['1-summary-1600','1-summary.html','?w=1600',1600,1000,true],
 ['1-summary-390','1-summary.html','?w=390',390,844,true],
 ['2-labels-1600','2-labels.html','',1600,1000,true],
 ['3-frames-a-390','3-mobile.html','?v=frames&o=a',390,844,true],
 ['3-frames-b-390','3-mobile.html','?v=frames&o=b',390,844,true],
 ['3-dial-a-390','3-mobile.html','?v=dial&o=a',390,844,true],
 ['3-dial-b-390','3-mobile.html','?v=dial&o=b',390,844,true],
 ['3-sheet-1600','3-sheet.html','',1600,1000,true],
 ['4-gates-1600','4-gates.html','',1600,1000,true]];
const want=process.argv.slice(2);
const list=want.length?ALL.filter(a=>want.some(w=>a[0].indexOf(w)===0)):ALL;
fs.mkdirSync(SHOTS,{recursive:true});
(async()=>{
 const br=await chromium.launch({executablePath:EXE,args:['--disable-background-networking','--disable-component-update']});
 const log=[];let bad=0;
 for(const [nm,file,q,W,H,full] of list){
  const f=path.join(DIR,file);if(!fs.existsSync(f)){log.push(nm+'  MISSING '+file);bad++;continue;}
  const ctx=await br.newContext({viewport:{width:W,height:H},deviceScaleFactor:2});
  const pg=await ctx.newPage();
  pg.on('request',r=>{const u=r.url();if(!/^(file|data):/.test(u)){log.push(nm+'  OFF MACHINE  '+u);bad++;}});
  pg.on('requestfailed',r=>{log.push(nm+'  FAILED  '+r.url());bad++;});
  pg.on('pageerror',e=>{log.push(nm+'  pageerror  '+e.message);bad++;});
  pg.on('console',m=>{if(m.type()==='error'){log.push(nm+'  console  '+m.text());bad++;}});
  await pg.goto('file://'+f+q,{waitUntil:'load'});
  await pg.evaluate(()=>document.fonts.ready);
  try{await pg.waitForFunction(()=>window.__ready===true,null,{timeout:5000});}
  catch(e){log.push(nm+'  never set __ready');bad++;}
  await pg.waitForTimeout(250);
  const fam=await pg.evaluate(()=>{const f=[];document.fonts.forEach(x=>{if(x.status==='loaded')f.push(x.family);});return f;});
  if(!fam.some(x=>/Inter/.test(x))){log.push(nm+'  Inter did not load');bad++;}
  /* anything a page measured about itself, printed beside the shot */
  const m=await pg.evaluate(()=>window.__measure||null);
  await pg.screenshot({path:path.join(SHOTS,nm+'.png'),fullPage:full});
  log.push(nm+'  ok'+(m?'  '+JSON.stringify(m):''));
  await ctx.close();}
 await br.close();
 fs.writeFileSync(path.join(SHOTS,'requests.log'),['THE REQUEST LOG for the round CB comps. Written by shoot.js.',
  'Any line marked OFF MACHINE is a request that left the computer, and there must be none.',''].concat(log).join('\n')+'\n');
 console.log(log.join('\n'));
 console.log(bad?'\n'+bad+' problem(s)':'\nclean: no request left the machine, no page errors');
 process.exit(bad?1:0);})();
