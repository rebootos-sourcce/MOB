/* Builds the new pages INSIDE the real app and takes the pictures.
   Run from the repo root:  NODE_PATH=/opt/node22/lib/node_modules node mockups/journal-avatar/src/shoot.js [filter]
   Reads source.html (the real build), never edits it. */
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path');
const ROOT=path.resolve(__dirname,'../../..');
const OUT=path.resolve(__dirname,'..');
const CSS=fs.readFileSync(path.join(__dirname,'mock.css'),'utf8');
const JS=fs.readFileSync(path.join(__dirname,'content.js'),'utf8');
const TXT="I told my team the launch was fine. It was not fine. I stayed quiet in the meeting while he took the credit, and my chest went tight. I am furious and I feel ashamed that I let it go. I work until the work is done and the work is never done. Rest feels like a moral failure.";
const EXE='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

async function open(b,W,H){
 const p=await b.newPage({viewport:{width:W,height:H}});
 p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));
 await p.goto('file://'+path.join(ROOT,'source.html')+'?dev=1');
 try{await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:12000});}catch(e){}
 await p.waitForTimeout(500);
 return p;
}
/* mode: 'before' (the shipped page as is) or 'after' (the new content). page: 'journal' | 'avatar'. state: 'loaded' | 'empty' */
async function build(p,page,state,mode,committed){
 await p.evaluate(([state])=>{
  const idx=state==='loaded'?PEOPLE.findIndex(x=>x.nm==='Diane'):PEOPLE.findIndex(x=>x.you);
  loadP(idx);
 },[state]);
 const tab=page==='journal'?0:5;
 await p.evaluate(t=>{setTab(t);render&&render();},tab);
 await p.waitForTimeout(500);
 if(page==='journal'&&state==='loaded'){
  await p.fill('#sttext',TXT);await p.waitForTimeout(500);
 }
 if(mode==='after'){
  await p.addStyleTag({content:CSS});
  await p.addScriptTag({content:JS});
  await p.evaluate(([page,state,committed])=>{
   (page==='journal'?MOCK.journalPage:MOCK.avatarPage)({state,committed});
  },[page,state,!!committed]);
  await p.waitForTimeout(500);
 }
 /* the whole page, not the first screen: grow the window to the content */
 for(let k=0;k<2;k++){
  const need=await p.evaluate(page=>{
   const h=document.getElementById(page==='journal'?'stflow':'iq');
   const st=document.getElementById('stage').getBoundingClientRect();
   return Math.ceil(st.top+(h?h.scrollHeight:800)+40);},page);
  const vp=p.viewportSize();
  await p.setViewportSize({width:vp.width,height:Math.min(Math.max(need,700),9000)});
  await p.waitForTimeout(400);
 }
}
(async()=>{
 const only=process.argv[2]||'';
 const b=await chromium.launch({executablePath:EXE});
 const jobs=[];
 for(const W of [1600,390])for(const page of ['journal','avatar'])for(const state of ['loaded','empty'])jobs.push({W,page,state});
 jobs.push({W:1600,page:'journal',state:'loaded',committed:true},{W:390,page:'journal',state:'loaded',committed:true});
 for(const j of jobs){
  const nm=`${j.page}${j.state==='empty'?'-empty':j.committed?'-committed':''}-${j.W}`;
  if(only&&!nm.includes(only))continue;
  for(const mode of ['after','before']){
   if(mode==='before'&&(j.committed))continue;
   const p=await open(b,j.W,900);
   await build(p,j.page,j.state,mode,j.committed);
   const f=mode==='after'?`${OUT}/${nm}.png`:`${OUT}/before/${j.page}${j.state==='empty'?'-empty':''}-${j.W}-shipped.png`;
   await p.screenshot({path:f});
   const m=await p.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth}));
   console.log(mode,nm,JSON.stringify(m),p.errs.join('|'));
   await p.close();
  }
 }
 await b.close();
})();
