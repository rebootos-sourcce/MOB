/* The worst case, measured. For every person, every direction and the three
   viewports, seeks to the head of every block (the longest statement, said once
   per block) and to a pass, and checks that the prompt fits the zone it is set
   in, that nothing in the scene runs under the bar, and that the document does
   not scroll. Prints the worst fit per viewport and direction.

     NODE_PATH=/opt/node22/lib/node_modules node mockups/release-redesign/check.js */
const {chromium}=require('playwright');
const path=require('path');
const VP={'1600x1000':[1600,1000],'390x844':[390,844],'360x640':[360,640]};
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
 const res={};
 for(const [vn,[w,h]] of Object.entries(VP)) for(const dir of ['edges','ring','stage']) for(const who of ['gordon','derek','angela','sofia']){
  const p=await b.newPage({viewport:{width:w,height:h}});
  await p.goto('file://'+path.resolve(__dirname,'room.html')+`?bare=1&dir=${dir}&who=${who}&at=0.0.0&f=.9`);
  await p.waitForTimeout(250);
  const r=await p.evaluate(()=>{
   const out={headMax:0,zone:0,under:0,scroll:0,lines:0,worst:''};
   const z=document.querySelector('.rel-zone'); out.zone=Math.round(z.clientHeight);
   const foot=document.getElementById('foot').getBoundingClientRect();
   REL.BLOCKS.forEach((bl,i)=>{
    [0,1,2].forEach(pp=>{
     const T=REL.OPEN_END+bl.t0+(pp===0?bl.hd*0.9:bl.hd+(pp-1+.5)*4);
     REL.seek(T);
     const pr=document.getElementById('prompt'), nx=document.getElementById('next');
     const used=pr.offsetHeight+(nx.textContent?nx.offsetHeight+10:0);
     if(used>out.headMax){out.headMax=Math.round(used);out.worst=(pp===0?'head ':'pass ')+bl.a.k+' '+bl.key;}
     const inst=document.getElementById('inst');
     const bottoms=[z.getBoundingClientRect().bottom, inst?inst.getBoundingClientRect().bottom:0, document.getElementById('sRun').getBoundingClientRect().bottom];
     const top=document.getElementById('foot').getBoundingClientRect().top;
     bottoms.forEach(x=>{if(x>top+1)out.under=Math.max(out.under,Math.round(x-top));});
    });});
   out.scroll=document.documentElement.scrollHeight-innerHeight;
   const c=document.querySelectorAll('#rel button:not([hidden]),#rel [role=switch]'); out.choices=c.length;
   return out;});
  const k=vn+' '+dir; (res[k]=res[k]||[]).push(r);
  await p.close();}
 for(const k of Object.keys(res)){const a=res[k];
  console.log(k.padEnd(14),'zone',a[0].zone,'px  tallest prompt+next',Math.max(...a.map(x=>x.headMax)),'('+a.sort((x,y)=>y.headMax-x.headMax)[0].worst+')',
   ' under the bar',Math.max(...a.map(x=>x.under)),' page scroll',Math.max(...a.map(x=>x.scroll)),' buttons',a[0].choices);}
 await b.close();
})();
