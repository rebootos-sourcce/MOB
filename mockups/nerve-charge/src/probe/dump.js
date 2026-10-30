/* Dumps the real address deck, in the order the deck draws it, for the people
   the mockup carries, plus the house tokens and every glyph it uses, from a
   scratch build of HEAD. node dump.js BUILD > data.json */
const {chromium}=require('playwright');
const F=process.argv[2];
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const p=await b.newPage({viewport:{width:1600,height:1000}});
 await p.goto('file://'+F+'?dev=1');
 try{await p.waitForFunction(()=>document.body.classList.contains('booted'),null,{timeout:12000});}catch(e){}
 await p.evaluate(()=>{if(typeof dualPoleState!=='function'){window.dualPoleState=function(p){return p<20?'op':p<40?'im':p<60?'mo':p<80?'he':'cl';};window.dualPoleStateWord=function(k){return k;};}});
 const out=await p.evaluate(()=>{
  const cs=getComputedStyle(document.body), tok={};
  ['--bg','--panel','--panel-2','--ink','--mid','--dim','--edge','--accent','--num'].forEach(k=>tok[k]=cs.getPropertyValue(k).trim());
  tok.bodyBg=cs.backgroundColor; tok.font=cs.fontFamily;
  const seatC={}; BANDS.forEach(s=>seatC[s]=seatCol(s)); seatC.Heart=seatCol('Heart');
  const glyph={}, strike=NODE_STRIKE;
  const who=['You','Sofia','Diane','Marcus','Angela','Derek','James','Tomas'], people=[];
  who.forEach(nm=>{
   const i=PEOPLE.findIndex(x=>x.nm===nm); loadP(i);
   setTab(TAB.KNOW); KB_SEC='addr'; KB_SORT='weight'; kbRender();
   const rows=kbRows('addr'), by={}; rows.forEach(x=>by[x.t]=x);
   const order=[]; let seat='';
   document.querySelectorAll('#knowbody .kb-row.kbp, #knowbody .kbs-pn, #knowbody [data-kbpn]').forEach(e=>{
    if(!e.classList.contains('kbp')){var s=e.getAttribute('data-kbpn')||'';if(s)seat=s;return;}
    const t=e.querySelector('.kbp2-l').textContent, x=by[t];
    if(!glyph[x.ic])glyph[x.ic]=glyphPath(x.ic);
    order.push({seatGroup:seat,t:t,seat:x.seat,fam:x.s,nerve:x.o.n||'',p:x.p,q:x.q,opp:x.opp||'',
     held:+x.o.held.toFixed(3),rep:+x.o.rep.toFixed(3),sq:+x.o.sq.toFixed(3),pole:+x.o.pole.toFixed(3),ic:x.ic,
     c:x.col||seatCol(x.seat),aria:e.getAttribute('aria-label')});});
   people.push({nm:nm,role:PEOPLE[i].role,age:PEOPLE[i].age,rows:order});});
  return {tok,seatC,glyph,strike,people,stamp:(document.querySelector('meta[name=build]')||{}).content||''};});
 console.log(JSON.stringify(out));
 await b.close();})();
