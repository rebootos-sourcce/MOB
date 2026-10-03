/* THE SHOOTER for the four Field renditions. The house pattern, after
   proto/field-b/shoot-seventh.js: the same Chromium, every request logged,
   and a request off the machine fails the run.

   tools/shots.js is the project's harness and it renders source.html tab by
   tab, so it cannot open a mockup. It was used for the reference shots of
   the product as it ships; this does the same job for the renditions.

   Run from the repo root:
     NODE_PATH=/opt/node22/lib/node_modules node proto/field-rings/shoot.js [name ...]
   With no names it shoots all four. */
const {chromium}=require('playwright');
const path=require('path'),fs=require('fs');
const DIR=__dirname, SHOTS=path.join(DIR,'shots');
const EXE='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
/* the contact sheet goes last, because it shows the files the four write */
const ALL=['nested-frames','frame-to-circle','dial-with-callouts','fragment-field','compare'];
const want=process.argv.slice(2).length?process.argv.slice(2):ALL;
fs.mkdirSync(SHOTS,{recursive:true});
(async()=>{
 const br=await chromium.launch({executablePath:EXE});
 const log=[];let bad=0;
 for(const nm of want){
  const file=path.join(DIR,nm+'.html'); if(!fs.existsSync(file)){log.push(nm+'  MISSING');bad++;continue;}
  const ctx=await br.newContext({viewport:{width:1600,height:1000},deviceScaleFactor:1});
  const pg=await ctx.newPage();
  pg.on('request',r=>{const u=r.url();if(!/^(file|data):/.test(u)){log.push(nm+'  OFF MACHINE  '+u);bad++;}});
  pg.on('requestfailed',r=>{log.push(nm+'  FAILED  '+r.url());bad++;});
  pg.on('pageerror',e=>{log.push(nm+'  pageerror  '+e.message);bad++;});
  pg.on('console',m=>{if(m.type()==='error'){log.push(nm+'  console  '+m.text());bad++;}});
  await pg.goto('file://'+file,{waitUntil:'load'});
  await pg.evaluate(()=>document.fonts.ready);
  await pg.waitForTimeout(300);
  /* the face is the product's own or the shot is not a fair picture of it */
  const fam=await pg.evaluate(()=>{const f=[];document.fonts.forEach(x=>{if(x.status==='loaded')f.push(x.family);});return f;});
  if(!fam.some(f=>/Inter/.test(f))){log.push(nm+'  Inter did not load');bad++;}
  /* the contact sheet is a page of pictures, not a stage: shot whole, once */
  if(nm==='compare'){await pg.waitForTimeout(400);
   await pg.screenshot({path:path.join(SHOTS,'compare-1600.png'),fullPage:true});
   log.push(nm+'  ok  fonts '+fam.join(','));await ctx.close();continue;}
  await pg.screenshot({path:path.join(SHOTS,nm+'-1600.png')});
  /* and the stage alone at twice the density, for reading the detail */
  const ctx2=await br.newContext({viewport:{width:1600,height:1000},deviceScaleFactor:2});
  const p2=await ctx2.newPage(); await p2.goto('file://'+file,{waitUntil:'load'});
  await p2.evaluate(()=>document.fonts.ready); await p2.waitForTimeout(300);
  await (await p2.$('#stage')).screenshot({path:path.join(SHOTS,nm+'-stage@2x.png')});
  /* and the calm state, through the real toggles: the reading alone, with the
     structure off. A Field with no zoom has to hold with little on as well as
     with everything, and this is also the proof the toggles work */
  await p2.evaluate(()=>window.__off(['domains','stories','masks','archetypes','patterns','chains']));
  await p2.waitForTimeout(150);
  const offCount=await p2.evaluate(()=>document.querySelectorAll('.lay[aria-pressed="false"]').length);
  if(offCount!==6){log.push(nm+'  toggles: expected 6 off, found '+offCount);bad++;}
  await (await p2.$('#stage')).screenshot({path:path.join(SHOTS,nm+'-reading-stage@2x.png')});
  await ctx2.close();
  log.push(nm+'  ok  fonts '+fam.join(','));
  await ctx.close();}
 await br.close();
 fs.writeFileSync(path.join(SHOTS,'requests.log'),
  ['THE REQUEST LOG for the Field renditions. Written by shoot.js.',
   'Any line marked OFF MACHINE is a request that left the computer, and there must be none.',''].concat(log).join('\n')+'\n');
 console.log(log.join('\n'));
 console.log(bad?'\n'+bad+' problem(s)':'\nclean: no request left the machine, no page errors');
 process.exit(bad?1:0);
})();
