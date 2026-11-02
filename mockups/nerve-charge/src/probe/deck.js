/* Opens the real address deck on a scratch build of HEAD, for a named person,
   at a width, and measures it: row pitch, bar width, how many percent figures
   do not fit inside their own fill, rows above the fold. Screenshots it.
   node deck.js BUILD OUTDIR WHO WIDTH HEIGHT [weight|order] */
const {chromium}=require('playwright'), path=require('path');
const [F,OUT,WHO,W,H,SORT]=process.argv.slice(2);
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const p=await b.newPage({viewport:{width:+W,height:+H},deviceScaleFactor:+W<500?2:1});
 const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+F+'?dev=1');
 try{await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:12000});}catch(e){}
 await p.waitForTimeout(500);
 /* the build at HEAD throws in renderAmplifiers on any loaded person: the
    two helpers it calls were deleted by 3cdc18dc. Shimmed here with their
    own deleted bodies so the deck can be measured at all. */
 await p.evaluate(()=>{if(typeof dualPoleState!=='function'){
  window.dualPoleState=function(p){var w=Math.max(0,Math.min(100,+p||0));if(w<20)return 'op';if(w<40)return 'im';if(w<60)return 'mo';if(w<80)return 'he';return 'cl';};
  window.dualPoleStateWord=function(k){return {op:'open',im:'impaired',mo:'moderately impaired',he:'heavily impaired',cl:'blocked'}[k]||'';};}});
 const m=await p.evaluate(([who,sort])=>{
  if(who!=='blank'){var i=PEOPLE.findIndex(x=>(x.nm||'').toLowerCase()===who);loadP(i);}
  try{if(typeof closeSheets==='function')closeSheets();}catch(e){}
  setTab(TAB.KNOW); KB_SEC='addr'; KB_SORT=sort||'weight'; kbRender();
  document.querySelectorAll('.rd,.sheet,.ov').forEach(e=>{});
  var rows=[...document.querySelectorAll('#knowbody .kb-row.kbp')];
  var r0=rows[0]&&rows[0].getBoundingClientRect(), r1=rows[1]&&rows[1].getBoundingClientRect();
  var cols=new Set(rows.map(r=>Math.round(r.getBoundingClientRect().left))).size;
  var pitch=null; for(var k=1;k<rows.length;k++){var a=rows[k].getBoundingClientRect();if(Math.round(a.left)===Math.round(r0.left)){pitch=a.top-r0.top;break;}}
  var bar=document.querySelector('#knowbody .kbp2-bar'), bw=bar?bar.getBoundingClientRect().width:0;
  var figs=[...document.querySelectorAll('#knowbody .kbp2-fl b,#knowbody .kbp2-fr b')];
  var clipped=figs.filter(f=>{var fr=f.parentElement.getBoundingClientRect(), br=f.getBoundingClientRect();return br.width+7>fr.width+0.5;}).length;
  var last=rows[rows.length-1].getBoundingClientRect();
  var top=rows[0].getBoundingClientRect().top+window.scrollY;
  var fold=rows.filter(r=>r.getBoundingClientRect().bottom<=innerHeight).length;
  var oneSided=rows.filter(r=>!r.querySelector('.kbp2-r').textContent.trim()).length;
  window.scrollTo(0,top-120);
  return {rows:rows.length,cols,rowH:r0.height,pitch,barW:Math.round(bw),figs:figs.length,clipped,
   deckH:Math.round(last.bottom-r0.top),aboveFold:fold,oneSided};},[WHO,SORT]);
 await p.waitForTimeout(400);
 const name=path.join(OUT,'deck-'+WHO+'-'+W+'-'+(SORT||'weight')+'.png');
 await p.screenshot({path:name});
 console.log(WHO,W,JSON.stringify(m),errs.length?'ERRORS '+errs.join(' | '):'');
 await b.close();})();
